class MathExpression {
    originalExpression: string
    expression: string
    isValid: boolean
    result: number | null
    error: string

    constructor(expression: string) {
        this.originalExpression = expression;
        this.expression = this.cleanExpression(expression);
        this.isValid = false;
        this.result = null;
        this.error = '';

        this.validate();
        if (this.isValid) {
            this.calculate();
        }
    }

    cleanExpression(expression: string) {
        return expression.replace(/[^0-9\.\+\*]/g, '');
    }

    validate() {
        if (!this.expression) {
            this.error = 'Выражение не может быть пустым';
            this.isValid = false;
            return;
        }

        if (/([\+\*]{2,})|(^[\+\*])|([\+\*]$)/.test(this.expression)) {
            this.error = 'Некорректная последовательность операторов';
            this.isValid = false;
            return;
        }

        const tokens = this.tokenize(this.expression);
        for (const token of tokens) {
            if (!['+', '*'].includes(token) && !this.isValidNumber(token)) {
                this.error = `Некорректное число: ${token}`;
                this.isValid = false;
                return;
            }
        }

        this.isValid = true;
    }

    isValidNumber(str: string) {
        if (!str || str === '.') return false;
        if (str.includes('.')) {
            const parts = str.split('.');
            if (parts.length !== 2 || parts[0] === '' && parts[1] === '') return false;
        }
        return !isNaN(parseFloat(str)) && isFinite(parseFloat(str));
    }

    tokenize(expression: string) {
        const tokens = [];
        let current = '';

        for (let i = 0; i < expression.length; i++) {
            const char = expression[i];

            if (char === '+' || char === '*') {
                if (current) {
                    tokens.push(current);
                    current = '';
                }
                tokens.push(char);
            } else {
                current += char;
            }
        }

        if (current) {
            tokens.push(current);
        }

        return tokens;
    }

    calculate() {
        let tokens = this.tokenize(this.expression);

        let i = 0;
        while (i < tokens.length) {
            if (tokens[i] === '*') {
                const left = parseFloat(tokens[i - 1]);
                const right = parseFloat(tokens[i + 1]);
                const multiplicationResult = left * right;


                tokens.splice(i - 1, 3, multiplicationResult.toString());
                i--;
            }
            i++;
        }


        let result = parseFloat(tokens[0]);
        for (let i = 1; i < tokens.length; i += 2) {
            if (tokens[i] === '+') {
                const right = parseFloat(tokens[i + 1]);
                result += right;
            }
        }

        this.result = result;
    }

    getResult() {
        return this.result;
    }


    getCleanedExpression() {
        return this.expression;
    }

    getError() {
        return this.error;
    }
}

export function calculateExpression(expression: string) {
    const mathExpr = new MathExpression(expression);
    return {
        success: mathExpr.isValid,
        result: mathExpr.getResult(),
        cleanedExpression: mathExpr.getCleanedExpression(),
        error: mathExpr.getError(),
    };
}