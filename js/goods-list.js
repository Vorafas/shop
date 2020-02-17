export default Vue.component('goods-list', {
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