import './mathFormHandler'

function processNameForm(lastName: string, firstName: string, middleName: string = ''): string | undefined {
    document.querySelectorAll('.error-message')?.forEach(el => el.remove());
    const parsedLastName = parseName(lastName);
    const parsedFirstName = parseName(firstName);
    const parsedMiddleName = middleName ? parseName(middleName) : '';

    const validationResult = validateValues({ lastName: parsedLastName, firstName: parsedFirstName, middleName: parsedMiddleName});
    if (validationResult !== true) {
        validationResult.forEach(error => {
            const field = document.getElementById(error.field);
            const element = document.createElement('div')
            element.classList.add('error-message');
            const messageElement = document.createElement('span')
            messageElement.textContent = error.message
            element.append(messageElement);
            field?.parentNode?.append(element);
        })

        return;
    }

    return formatInitials(parsedLastName, parsedFirstName, parsedMiddleName);
}

function parseName(name: string): string {
    return name
        .trim()
        .replace(/\s+/g, ' ')
        .split(' ')
        .map(word => {
            if (!word) return '';
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(' ');
}

function validateValues(props: {lastName: string, firstName: string, middleName: string, [index: string]: string}): true | {field: string, message: string}[] {

    const errors: {field: string, message: string}[] = []

    ;['lastName', 'firstName', 'middleName'].forEach(field => {
        const element = document.getElementById(field) as HTMLInputElement

        if ((element.required || props[field]) && props[field]?.length < 2) {
            errors.push({
                field,
                message: 'Минимум 2 символа'
            })
        } else if (props[field]) {
            const valueRegex = /^[A-Za-zА-Яа-яЁё\s-]+$/;

            if (!valueRegex.test(props[field])) {
                errors.push({
                    field,
                    message: 'Недопустимые символы'
                })
            }
        }
    })

    if (errors.length) {
        return errors
    }

    return true
}

function formatInitials(lastName: string, firstName: string, middleName: string): string {
    const firstInitial = firstName.charAt(0) + '.';
    const middleInitial = middleName ? middleName.charAt(0) + '.' : '';
    return `${lastName} ${firstInitial}${middleInitial}`.trim();
}

if (typeof window !== 'undefined') {
    (window as any).processNameForm = processNameForm;
}

function processForm() {
    const lastName = (document.getElementById('lastName') as HTMLInputElement)?.value.trim();
    const firstName = (document.getElementById('firstName') as HTMLInputElement)?.value.trim();
    const middleName = (document.getElementById('middleName') as HTMLInputElement)?.value.trim();

        const result = processNameForm(lastName, firstName, middleName);
        updateOutput(result);
}

function updateOutput(message: string | undefined) {
    const output = document.getElementById('fullNameOutput');
    if (!output) return;

    output.classList.remove('success', 'waiting');

    if (!message) {
        output.classList.add('waiting');
        return output.textContent = 'Введите данные выше';
    }

    output.textContent = message;
    output.classList.add('success');
}

function clearForm() {
    (document.getElementById('nameForm') as HTMLFormElement)?.reset();
    document.querySelectorAll('.error-message')?.forEach(el => el.remove());
    updateOutput(undefined);
}

document.getElementById('nameForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    processForm();
});

document.getElementById('clearForm')?.addEventListener('click', (_) => {
    clearForm();
})