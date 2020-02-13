import goodsItem from './goods-item';
import cartItem from './cart-item';
import cart from './cart';
import notification from './notification';
import goodsList from './goods-list';
import goodsSearch from './goods-search';

const app = new Vue({
    el: '#app',
    data: {
        goods: [],
        filteredGoods: [],
        cart: [],
        isVisibleCart: false,
    },
    methods: {
        request(method, url, data, heads) {
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

                xhr.open(method, url);
                for (const key in heads) {
                    xhr.setRequestHeader(key, heads[key]);
                }
                xhr.send(data || null);
            });
        },
        toggleCartVisibility() {
            this.isVisibleCart = !this.isVisibleCart;
        },
        async removeToCart(id) {
            try {
                this.cart = await this.request('DELETE', '/api/cart/' + id, null, {
                    'Content-type': 'application/x-www-form-urlencoded'
                });
            } catch (error) {
                this.$refs.notification.notify(new Error(error));
                console.error(error);
            }
        },
        async addToCart(good) {
            try {
                this.cart = await this.request('POST', '/api/cart', JSON.stringify(good), {
                    'Content-type': 'application/json; charset=utf-8'
                });
            } catch (error) {
                this.$refs.notification.notify(new Error(error));
                console.error(error);
            }
        },
        async fetchCart() {
            try {
                this.cart = await this.request('GET', '/api/cart');
            } catch (error) {
                this.$refs.notification.notify(new Error(error));
                console.error(error);
            }
        },
        async fetchGoods() {
            try {
                this.goods = await this.request ('GET', '/api/goods');
                this.filteredGoods = [...this.goods];
            } catch (e) {
                this.$refs.notification.notify(new Error(e));
                console.error(e);
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            const goodsPromise = this.fetchGoods();
            const cartPromise = this.fetchCart();
            Promise.all([goodsPromise, cartPromise]);
        });
    }
});