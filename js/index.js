const API_URL = "https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses";

Vue.component('goods-item', {
    props: ['good'],
    template: `
        <div class="goods-item">
            <img class="image" src="https://via.placeholder.com/250" alt="alt">
            <h3>{{ good.product_name }}</h3>
            <p>{{ good.price }}</p>
            <button>Добавить</button>
        </div>
    `
});

Vue.component('cart-button', {
    data() {
        return {
            isVisibleCart: false,
        }
    },
    methods: {
        toggleCartVisibility() {
            this.isVisibleCart = !this.isVisibleCart;
        }
    },
    template: `
        <div class="cart">
            <button class="cart-button"  @click="toggleCartVisibility">Корзина</button>
            <transition name="fade">
                <div class="cart-container" v-if="isVisibleCart">
                    <ul class="cart-goods"></ul>
                </div>
            </transition>
        </div>
    `
});

Vue.component('error', {
    data() {
        return {
            description: '',
            timerId: null
        }
    },
    methods: {
        clearDescription() {}
    },
    computed: {
        isShowError() {
            return (typeof this.description === 'string' && this.description.length > 5);
        }
    },
    mounted() {
        this.$parent.$on('error', (description) => {
            clearTimeout(this.timerId);

            this.description = description;
            
            this.timerId = setTimeout(() => {
                this.description = '';
            }, 10000);
        });
    },
    template: `
        <div class="error" v-if="isShowError">
            <div class="error-title">Ошибка</div>
            <div class="error-msg">{{ description }}</div>
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
                        :key="good.id_product" :good="good"></goods-item>
        </div>
        <div class="goods-not-found" v-else>
            <h3>Нет данных</h3>
        </div>
    `
});

Vue.component('goods-search', {
    props: ['goods'],
    data() {
        return {
            searchLine: '',
            filteredGoods: [],
        }
    },
    methods: {
        searchGoods(event) {
            event.preventDefault();
            this.filterGoods(this.searchLine);
        },
        filterGoods(value) {
            const regexp = new RegExp(value, 'i');
            this.filteredGoods = this.goods.filter((good) => {
                return regexp.test(good.product_name);
            });
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
                this.goods = await this.makeGetRequest(`${API_URL}/catalogData.json`)
                this.filteredGoods = [...this.goods];
            } catch (e) {
                this.$emit('error', e);
                console.error(e);
            }
        }
    },
    mounted() {
        this.fetchGoods();
    }
});