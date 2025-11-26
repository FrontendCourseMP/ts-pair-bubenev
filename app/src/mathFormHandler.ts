import {calculateExpression} from "./mathParser";

console.debug(123123)

document.getElementById("mathForm")?.addEventListener('submit', (e) => {
    e.preventDefault()
    const expression = (document.getElementById("mathInput") as HTMLInputElement)?.value;
    const resultElement = document.getElementById("mathOutput");

    if (!resultElement) return

    const result = calculateExpression(expression);

    if (result.result) {
        resultElement.textContent = result.result.toString();
        resultElement.classList.add('success');
        resultElement.classList.remove('waiting');
    }
})

document.getElementById("mathClear")?.addEventListener('click', (_) => {
        (document.getElementById('mathForm') as HTMLFormElement)?.reset();
        document.querySelectorAll('.error-message')?.forEach(el => el.remove());
        const resultElement = document.getElementById("mathOutput");
        if (!resultElement) return
        resultElement.textContent = 'Введите данные выше'
        resultElement.classList.remove('success');
        resultElement.classList.add('waiting');
})