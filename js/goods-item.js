export default Vue.component('goods-item', {
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