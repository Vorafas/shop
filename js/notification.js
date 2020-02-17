export default Vue.component('notification', {
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
});