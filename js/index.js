const API_URL = "https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses";

const app = new Vue({
    el: '#app',
    data: {
        goods: [],
        filteredGoods: [],
        searchLine: '',
        isVisibleCart: false,
        searchLine: '',
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
        },
        clickCard() {
            this.isVisibleCart = !this.isVisibleCart;
        },
        filterGoods(value) {
            const regexp = new RegExp(value, 'i');
            this.filteredGoods = this.goods.filter((good) => {
                return regexp.test(good.product_name);
            });
        },
        searchGoods(event) {
            event.preventDefault();
            let value = event.target.querySelector('.goods-search-value').value;
            value = value.trim();
            this.filterGoods(value);
        },
        async fetchGoods() {
            try {
                this.goods = await this.makeGetRequest(`${API_URL}/catalogData.json`)
                this.filteredGoods = [...this.goods];
            } catch (e) {
                console.error(e);
            }
        }
    },
    mounted() {
        this.fetchGoods();
    },
    computed: {
        hasFilteredGoods() {
            return this.filteredGoods.length > 0;
        }
    }
});