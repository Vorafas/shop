export default Vue.component('cart-item', {
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
});