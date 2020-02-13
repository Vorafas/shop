!function(t){var e={};function o(i){if(e[i])return e[i].exports;var r=e[i]={i:i,l:!1,exports:{}};return t[i].call(r.exports,r,r.exports,o),r.l=!0,r.exports}o.m=t,o.c=e,o.d=function(t,e,i){o.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i})},o.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},o.t=function(t,e){if(1&e&&(t=o(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(o.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)o.d(i,r,function(e){return t[e]}.bind(null,r));return i},o.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return o.d(e,"a",e),e},o.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},o.p="",o(o.s=0)}([function(t,e,o){"use strict";o.r(e);Vue.component("goods-item",{props:["good"],methods:{addToCart(){return this.$emit("add",this.good)}},template:'\n        <div class="goods-item">\n            <img class="image" src="https://via.placeholder.com/250" alt="alt">\n            <h3>{{ good.name }}</h3>\n            <p>{{ good.price }}</p>\n            <button @click="addToCart">Добавить</button>\n        </div>\n    '}),Vue.component("cart-item",{props:["good"],methods:{removeToCart(){return this.$emit("remove",this.good)}},template:'\n        <li>\n            <div class="title">{{ good.name }}</div>\n            <div class="price">{{ good.price }} ₽</div>\n            <button class="remove-good" @click="removeToCart">Удалить из корзины</button>\n        </li>\n    '}),Vue.component("cart",{props:["cart"],data:()=>({isVisibleCart:!1}),methods:{toggleCartVisibility(){this.isVisibleCart=!this.isVisibleCart},removeToCart(t){this.$emit("remove",t.id)}},computed:{isCartEmpty(){return 0===this.cart.length}},template:'\n        <div class="cart">\n            <button class="cart-button"  @click="toggleCartVisibility">Корзина</button>\n            <transition name="fade">\n                <div class="cart-container" v-if="isVisibleCart">\n                    <ul class="cart-goods" v-if="!isCartEmpty">\n                        <cart-item v-for="good in cart" :key="good.id" :good="good" @remove="removeToCart" />\n                    </ul>                  \n                    <div class="card-empty" v-else>\n                        <h3>Корзина пуста</h3>\n                    </div>\n                </div>\n            </transition>\n        </div>\n    '}),Vue.component("notification",{data:()=>({error:null,wait:5e3}),methods:{notify(t){this.error=t,setTimeout(()=>{this.clean()},this.wait)},clean(){this.error=null}},template:'\n        <div class="error" v-if="error">\n            <div class="error-title">Ошибка</div>\n            <div class="error-msg">{{ error.message }}</div>\n        </div>\n    '}),Vue.component("goods-list",{props:["goods"],computed:{isFilteredGoodsEmpty(){return 0===this.goods.length}},methods:{addToCart(t){this.$emit("add",t)}},template:'\n        <div class="goods-list" v-if="!isFilteredGoodsEmpty">\n            <goods-item v-for="good in goods" @add="addToCart"\n                        :key="good.id" :good="good"></goods-item>\n        </div>\n        <div class="goods-not-found" v-else>\n            <h3>Нет данных</h3>\n        </div>\n    '}),Vue.component("goods-search",{props:["goods","filteredGoods"],data:()=>({searchLine:""}),methods:{searchGoods(t){t.preventDefault(),this.filterGoods(this.searchLine)},filterGoods(t){const e=new RegExp(t,"i"),o=this.goods.filter(t=>e.test(t.name));this.$emit("update:filteredGoods",o)}},template:'\n        <form class="goods-search" @submit="searchGoods">\n            <input type="text" class="goods-search-value" v-model.trim="searchLine">\n            <button type="submit" class="goods-search-button">Искать</button>\n        </form>\n    '});new Vue({el:"#app",data:{goods:[],filteredGoods:[],cart:[],isVisibleCart:!1},methods:{request:(t,e,o,i)=>new Promise((r,s)=>{let n;n=window.XMLHttpRequest?new window.XMLHttpRequest:new window.ActiveXObject("Microsoft.XMLHTTP"),n.onreadystatechange=function(){if(4===n.readyState)if(200===n.status){const t=JSON.parse(n.responseText);r(t)}else s(`XMLHttpRequest status: ${n.status}`)},n.open(t,e);for(const t in i)n.setRequestHeader(t,i[t]);n.send(o||null)}),toggleCartVisibility(){this.isVisibleCart=!this.isVisibleCart},async removeToCart(t){try{this.cart=await this.request("DELETE","/api/cart/"+t,null,{"Content-type":"application/x-www-form-urlencoded"})}catch(t){this.$refs.notification.notify(new Error(t)),console.error(t)}},async addToCart(t){try{this.cart=await this.request("POST","/api/cart",JSON.stringify(t),{"Content-type":"application/json; charset=utf-8"})}catch(t){this.$refs.notification.notify(new Error(t)),console.error(t)}},async fetchCart(){try{this.cart=await this.request("GET","/api/cart")}catch(t){this.$refs.notification.notify(new Error(t)),console.error(t)}},async fetchGoods(){try{this.goods=await this.request("GET","/api/goods"),this.filteredGoods=[...this.goods]}catch(t){this.$refs.notification.notify(new Error(t)),console.error(t)}}},mounted(){this.$nextTick(()=>{const t=this.fetchGoods(),e=this.fetchCart();Promise.all([t,e])})}})}]);