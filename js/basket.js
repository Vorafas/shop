class BasketItem {
    constructor(id, title = 'Без названия', price = 0, img = '') {
        this.id = id;
        this.title = title;
        this.price = price;
        this.img = img;
    }

    render() {

    }
}

class Basket {
    constructor (container) {
        this.goods = [];
        this.container = document.querySelector(container);
    }

    fetchGoods() {

    }

    calculateTotalPrice() {

    }

    removeGoods() {
        
    }

    orderGoods() {

    }

    render() {

    }
}