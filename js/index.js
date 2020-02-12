Vue.component('goods-item', {
    props: ['good'],
    methods: {
        addToCart() {
            return this.$emit('add', this.good)
        }
    },
    template: `
        <div class="goods-item">
            <img class="image" src="https://via.placeholder.com/250" alt="alt">
            <h3>{{ good.name }}</h3>
            <p>{{ good.price }}</p>
            <button @click="addToCart">Добавить</button>
        </div>
    `
});

Vue.component('cart-item', {
    props: ['good'],
    methods: {
        removeToCart() {
            return this.$emit('remove', this.good);
        }
    },
    template: `
        <li>
            <div class="title">{{ good.name }}</div>
            <div class="price">{{ good.price }} ₽</div>
            <button class="remove-good" @click="removeToCart">Удалить из корзины</button>
        </li>
    `
})

Vue.component('cart', {
    props: ['cart'],
    data() {
        return {
            isVisibleCart: false,
        }
    },
    methods: {
        toggleCartVisibility() {
            this.isVisibleCart = !this.isVisibleCart;
        },
        removeToCart(good) {
            this.$emit('remove', good.id);
        }
    },
    computed: {
        isCartEmpty() {
            return this.cart.length === 0;
        }
    },
    template: `
        <div class="cart">
            <button class="cart-button"  @click="toggleCartVisibility">Корзина</button>
            <transition name="fade">
                <div class="cart-container" v-if="isVisibleCart">
                    <ul class="cart-goods" v-if="!isCartEmpty">
                        <cart-item v-for="good in cart" :key="good.id" :good="good" @remove="removeToCart" />
                    </ul>                  
                    <div class="card-empty" v-else>
                        <h3>Корзина пуста</h3>
                    </div>
                </div>
            </transition>
        </div>
    `
});

Vue.component('notification', {
    data() {
        return {
            error: null,
            wait: 5000
        }
    },
    methods: {
        notify(error) {
            this.error = error;
            setTimeout(() => {
                this.clean();
            }, this.wait);
        },
        clean() {
            this.error = null;
        }
    },
    template: `
        <div class="error" v-if="error">
            <div class="error-title">Ошибка</div>
            <div class="error-msg">{{ error.message }}</div>
        </div>
    `
})

Vue.component('goods-list', {
    props: ['goods'],
    computed: {
        isFilteredGoodsEmpty() {
            return this.goods.length === 0;
        }
    },
    methods: {
        addToCart(good) {
             this.$emit('add', good);
        }
    },
    template: `
        <div class="goods-list" v-if="!isFilteredGoodsEmpty">
            <goods-item v-for="good in goods" @add="addToCart"
                        :key="good.id" :good="good"></goods-item>
        </div>
        <div class="goods-not-found" v-else>
            <h3>Нет данных</h3>
        </div>
    `
});

Vue.component('goods-search', {
    props: ['goods', 'filteredGoods'],
    data() {
        return {
            searchLine: '',
        }
    },
    methods: {
        searchGoods(event) {
            event.preventDefault();
            this.filterGoods(this.searchLine);
        },
        filterGoods(value) {
            const regexp = new RegExp(value, 'i');
            const filteredGoods = this.goods.filter((good) => {
                return regexp.test(good.name);
            });
            this.$emit('update:filteredGoods', filteredGoods);
        },
    },
    template: `
        <form class="goods-search" @submit="searchGoods">
            <input type="text" class="goods-search-value" v-model.trim="searchLine">
            <button type="submit" class="goods-search-button">Искать</button>
        </form>
    `
});
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