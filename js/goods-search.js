export default Vue.component('goods-search', {
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