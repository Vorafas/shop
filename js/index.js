const API_URL = "https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses";
function makeGetRequest(url) {
    return new Promise((resolve, reject) => {
        let xhr;
        if (window.XMLHttpRequest) {
            xhr = new window.XMLHttpRequest();
        } else {
            xhr = new window.ActiveXObject("Microsoft.XMLHTTP");
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState !== 4) return;

            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                resolve(response);
            } else {
                reject(`XMLHttpRequest status: ${xhr.status}`);
            }
        }

        xhr.open("GET", url);
        xhr.send();
    });
}

class GoodsItem {
    constructor(id, title = 'Без названия', price = 0, img = 'https://via.placeholder.com/250') {
        this.id = id;
        this.title = title;
        this.price = price;
        this.img = img;
    }

    render() {
        return `
            <div class="goods-item" data-id="${this.id}">
                <img class="image" src="${this.img}" alt="alt" />
                <h3 class="title">${this.title}</h3>
                <p class="price">${this.price}</p>
                <button class="js-add-to-cart">Добавить</button>
            </div>  
        `;
    }
}

class GoodsList {
    constructor(container) {
        this.container = document.querySelector(container);
        this.goods = [];
    }

    initListeners() { }

    findGoods(id) {
        return this.goods.find((good) => good.id_product === id);
    }

    totalSum() {
        let sum = 0;
        for (const good of this.goods) {
            if (good.price) {
                sum += good.price;
            }
        }
        return sum;
    }

    fetchGoods() { }

    render() {
        let listHtml = '';
        this.goods.map(good => {
            const goodItem = new GoodsItem(good.id_product, good.product_name, good.price, good.img);
            listHtml += goodItem.render();
        });
        this.container.innerHTML = listHtml;
        this.initListeners();
    }
}

class GoodsPage extends GoodsList {
    addToCard(goodId) {
        return new Promise((resolve, reject) => {
            return makeGetRequest(`${API_URL}/addToBasket.json`).then((response) => {
                if (response.result === 1) {
                    const good = this.findGoods(goodId);
                    resolve(good);
                    console.log('Товар добавлен в корзину');
                } else {
                    reject('Error');
                }
            });
        });
    }

    fetchGoods() {
        return new Promise((resolve, reject) => {
            return makeGetRequest(`${API_URL}/catalogData.json`)
                .then((response) => {
                    this.goods = response;
                    resolve();
                });
        });
    }

    initListeners() {
        const buttons = [...this.container.querySelectorAll('.js-add-to-cart')];
        buttons.forEach(button => {
            button.addEventListener('click', (event) => {
                const goodId = event.target.parentElement.getAttribute('data-id');
                this.addToCard(parseInt(goodId, 10));
            });
        });
    }
}

class Card extends GoodsList {
    removeFromCart(goodId) {
        return Promise((resolve, reject) => {
            return makeGetRequest(`${API_URL}/deleteFromBasket.json`).then((response) => {
                if (response.result === 1) {
                    const good = this.findGoods(goodId);
                    resolve(good);
                    console.log('Товар удален из корзину');
                } else {
                    reject('Error');
                }
            });
        });

    }

    fetchGoods() {
        return new Promise((resolve, reject) => {
            return makeGetRequest(`${API_URL}/getBasket.json`).then((response) => {
                this.goods = response.contents;
                resolve();
            });
        });
    }

    clearCart() {

    }

    updateCartItem(id, goods) {

    }
}

class CartItem extends GoodsItem {
    constructor(...attrs) {
        super(attrs);
        this.count = 0;
    }

    incCount() {

    }

    decCount() {

    }
}

const list = new GoodsPage('.goods-list');
list.fetchGoods().then(() => {
    list.render();
});
