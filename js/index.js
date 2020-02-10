function request(method, url, params, useCustomRequestHeader) {
    return new Promise((resolve, reject) => {
        let xhr;
        if (window.XMLHttpRequest) {
            xhr = new window.XMLHttpRequest();
        } else {
            xhr = new window.ActiveXObject("Microsoft.XMLHTTP");
        }

        xhr.onreadystatechange = function() {
            if (xhr.readyState !== 4) return;

            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                resolve(response);
            } else {
                reject(`XMLHttpRequest status: ${xhr.status}`);
            }
        }

        xhr.open(method, url);
        if (useCustomRequestHeader) {
            for (const key in useCustomRequestHeader) {
                xhr.setRequestHeader(key, useCustomRequestHeader[key]);
            }
        } else if (method === 'POST') {
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        }
        xhr.send(params || null);
    });
}

Vue.component('goods-item', {
    props: ['good'],
    methods: {
        addCard() {
            request('POST', '/api/cart', JSON.stringify(this.good), {
                'Content-type': 'application/json; charset=utf-8'
            });
        }
    },
    template: `
        <div class="goods-item">
            <img class="image" src="https://via.placeholder.com/250" alt="alt">
            <h3>{{ good.name }}</h3>
            <p>{{ good.price }}</p>
            <button @click="addCard">Добавить</button>
        </div>
    `
});

Vue.component('cart', {
    data() {
        return {
            isVisibleCart: false,
            goods: [],
        }
    },
    methods: {
        toggleCartVisibility() {
            this.isVisibleCart = !this.isVisibleCart;
            if (this.isVisibleCart) {
                this.fetchGoods();
            }
        },
        fetchGoods() {
            return request('GET', '/api/cart').then((response) => {
                if (response) {
                    this.goods = response;
                }
            });
        },
        removeGoods(id) {
            return request('POST', '/api/cart/' + id).then((response) => {
                if (response && response.result === 1) {
                    this.fetchGoods();
                }
            });
        }
    },
    computed: {
        isCartEmpty() {
            return this.goods.length === 0;
        }
    },
    template: `
        <div class="cart">
            <button class="cart-button"  @click="toggleCartVisibility">Корзина</button>
            <transition name="fade">
                <div class="cart-container" v-if="isVisibleCart">
                    <ul class="cart-goods" v-if="!isCartEmpty">
                        <li v-for="good in goods" :key="good.id">
                            <div class="title">{{ good.name }}</div>
                            <div class="price">{{ good.price }} ₽</div>
                            <button class="remove-good" @click="removeGoods(good.id)">Удалить из корзины</button>
                        </li>
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
    template: `
        <div class="goods-list" v-if="!isFilteredGoodsEmpty">
            <goods-item v-for="good in goods" 
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
        isVisibleCart: false,
    },
    methods: {
        makeGetRequest(url) {
            return new Promise((resolve, reject) => {
                let xhr;
                if (window.XMLHttpRequest) {
                    xhr = new window.XMLHttpRequest();
                } else {
                    xhr = new window.ActiveXObject("Microsoft.XMLHTTP");
                }

                xhr.onreadystatechange = function() {
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
        },
        toggleCartVisibility() {
            this.isVisibleCart = !this.isVisibleCart;
        },
        async fetchGoods() {
            try {
                this.goods = await request('GET', '/api/goods');
                this.filteredGoods = [...this.goods];
            } catch (e) {
                this.$refs.notification.notify(new Error(e));
                console.error(e);
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.fetchGoods();
        });
    }
});