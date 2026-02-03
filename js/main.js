Vue.component('product-details', {
    props: {
        details: {
            type: Number,
            required: true
        }
    },
    template: `
    <ul class="product-details">
        <li v-for="(detail, index) in details" :key="index" class="detail-item">
            <span class="detail-text">{{ detail }}</span>
        </li>
    </ul>`
})

Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
    <div class="product">
        <div class="product-image">
            <img :src="image" :alt="altText">
        </div>
        <div class="product-info">
            <h1>{{ title }}</h1>
            <p> {{ description }}</p>
            <a :href="link">More products like this</a>
            <p v-if="inStock">In Stock</p>
            <p v-else :class="{outOfStock: !inStock}" :style="{textDecoration: 'line-through'}">Out of Stock</p>
            <span>{{ sale }}</span>
            <product-details :details="details"></product-details>            
            <p>Shipping: {{ shipping }}</p>
            <div class="color-box"
                v-for="(variant, index) in variants"
                :key="variant.variantId"
                :style="{backgroundColor:variant.variantColor}"
                @mouseover="updateProduct(index)">
            </div>
            <div v-for="size in sizes">
                <p> {{ size }} </p>
            </div>
            <button 
                v-on:click="addToCart"
                :disabled="!inStock"
                :class="{disabledButton: !inStock}"
            >Add to cart</button>
            <button v-on:click="subFromCart">Sub to cart</button>
        </div>
    </div>
    `,
    data() {
        return {
            product: "Socks",
            brand: 'Vue Mastery',
            description: "A pair of warm, fuzzy socks",
            selectedVariant: 0,
            altText: "A pair of socks",
            link: "https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks",
            onSale: true,
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
            variants: [
                {
                    variantId: 2234,
                    variantColor: 'green',
                    variantImage: "./assets/vmSocks-green-onWhite.jpg",
                    variantQuantity: 10,
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 0,
                }
            ],
            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart',
            this.variants[this.selectedVariant].variantId);
        },
        subFromCart() {
            this.$emit('sub-from-cart',
            this.variants[this.selectedVariant].variantId)
        },
        updateProduct(index) {
            this.selectedVariant = index
        },
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity
        },
        sale() {
            if (this.onSale) {
                return `Распродажа! ${this.brand} ${this.product}`
            }
            else {
                return `${this.brand} ${this.product} - распродажа не проводится`
            }
        },
        shipping() {
            if (this.premium) {
                return "Free"
            } else {
                return 2.99
            }
        },
    }
})

let app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id)
        },
        removeFromCart(id) {
            const index = this.cart.indexOf(id)
            if (index > -1) {
                this.cart.splice(index, 1);
            }
        }
    }
})

// Vue - это реактивный фреймворк, данные связаны со всеми местами веб-страницы, в которых есть ссылки на эти данные.

// Vue.component('product', {}) - регистрация нового компонента, свойство el используется для организации его привязки к элементу DOM. В компонент иожно добавить всё из main.js, что связано с этим элементом, в нашем случае product.<