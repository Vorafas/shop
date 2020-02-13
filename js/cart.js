export default Vue.component('cart', {
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