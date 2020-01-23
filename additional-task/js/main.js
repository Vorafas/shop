class Hamburger {
    constructor(size, filling, seasoning, mayonnaise) {
        this.size = size;
        this.filling = filling;
        this.sseasoningize = seasoning;
        this.mayonnaise = mayonnaise;
    }

    totalPrice() {
        let result = 0;

        if (this.sseasoningize) result += 15;
        if (this.mayonnaise) result += 20;

        if (this.size === 'small') {
            result += 50;
        } else {
            result += 100;
        }

        if (this.sseasoningize === 'cheese') {
            result += 10;
        } else if (this.sseasoningize === 'salad') {
            result += 20;
        } else {
            result += 15;
        }

        return result;
    }

    totalCalories() {
        let result = 0;

        if (this.sseasoningize) result += 0;
        if (this.mayonnaise) result += 5;

        if (this.size === 'small') {
            result += 20;
        } else {
            result += 40;
        }

        if (this.sseasoningize === 'cheese') {
            result += 20;
        } else if (this.sseasoningize === 'salad') {
            result += 5;
        } else {
            result += 10;
        }

        return result;
    }
}


const form = document.querySelector('.form');
const message = document.querySelector('.message');

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const size = getCheckedValue('.size');
    const filling = getCheckedValue('.filling');
    const seasoning = document.querySelector('.seasoning').checked;
    const mayonnaise = document.querySelector('.mayonnaise').checked;

    if (size && filling) {
        const hamburger = new Hamburger(size, filling, seasoning, mayonnaise);
        message.textContent = `${hamburger.totalPrice()} руб. ${hamburger.totalCalories()} ккал.`;
    } else {
        message.textContent = 'Неободимо выбрать размер и начинку!!!';
    }
});

function getCheckedValue(name) {
    let result;
    const elements = document.querySelectorAll(name);
    elements.forEach(element => {
        if (element.checked) {
            result = element.value;
        }
    });
    return result;
}