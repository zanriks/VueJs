let eventBus = new Vue()
Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: false,
        },
        shipping: {
            type: [String, Number],
            required: true
        },
        details: {
            type: Array,
            required: true
        }
    },
    template: `
    <div>
       <ul class="tabs">
         <span
           class="tab"
           :class="{ activeTab: selectedTab === tab }"
           v-for="(tab, index) in tabs"
           :key="index"
           @click="selectedTab = tab"
         >
           {{ tab }}
         </span>
       </ul>
       
       <div v-show="selectedTab === 'Reviews'" class="tab-content">
         <p v-if="!reviews.length">There are no reviews yet.</p>
         <ul v-else>
           <li v-for="(review, index) in reviews" :key="index" class="review-item">
             <p><strong>{{ review.name }}</strong></p>
             <p>Rating: {{ review.rating }}</p>
             <p>{{ review.review }}</p>
             <p>Recommend: {{ review.recommend === 'yes' ? 'Yes' : 'No' }}</p>
           </li>
         </ul>
       </div>

       <div v-show="selectedTab === 'Make a Review'" class="tab-content">
         <product-review></product-review>
       </div>

        <div v-show="selectedTab === 'Shipping'" class="tab-content">
            <p v-if="shipping === 'Free'">
                <strong>Free shipping</strong> for premium members
            </p>
            <p v-else>
                <strong>Shipping cost: {{ shipping }} </strong>
            </p>
        </div>

        <div v-show="selectedTab === 'Details'" class="tab-content">
            <ul class="details-list">
                <li v-for="(detail, index) in details" :key="index">
                {{ detail }}
                </li>
            </ul>
        </div>
     </div>
`,
    data() {
        return {
            tabs: ['Reviews', 'Make a Review', 'Shipping', 'Details'],
            selectedTab: 'Reviews'
        }
    }
})
Vue.component('product-review', {
    template: `
        <form class="review-form" @submit.prevent="onSubmit">
            <p v-if="errors.length">
                <b>Please correct the following error(s):</b>
                <ul>
                    <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
                </ul>
            </p>
            <p>
                <label for="name">Name:</label>
                <input id="name" v-model="name" placeholder="name">
            </p>
            <p>
                <label for="review">Review:</label>
                <textarea id="review" v-model="review"></textarea>
            </p>
            <p>
                <label>Would you recommend this product?</label><br>
                <input type="radio" id="recommend-yes" value="yes" v-model="recommend">
                <label for="recommend-yes">Yes</label>
                <input type="radio" id="recommend-no" value="no" v-model="recommend">
                <label for="recommend-no">No</label>
            </p>
            <p>
                <label for="rating">Rating:</label>
                <select id="rating" v-model.number="rating">
                    <option>5</option>
                    <option>4</option>
                    <option>3</option>
                    <option>2</option>
                    <option>1</option>
                </select>
            </p>
            <p>
                <input type="submit" value="Submit">
            </p>
        </form>
`,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            recommend: null,
            errors: [],
        }
    },
    methods:{
        onSubmit() {
            this.errors = []
            if(this.name && this.review && this.rating && this.recommend) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    recommend: this.recommend,
                }
                eventBus.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
                this.recommend = null
            } else {
                if(!this.name) this.errors.push("Name required.")
                if(!this.review) this.errors.push("Review required.")
                if(!this.rating) this.errors.push("Rating required.")
                if(!this.recommend) this.errors.push("Recommend required.")
            }
        }
    }
})

Vue.component('product-details', {
    props: {
        details: {
            type: Array,
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
            <p>{{ description }}</p>
            <a :href="link">More products like this</a>
            <p v-if="inStock">In Stock</p>
            <p v-else class="out-of-stock">Out of Stock</p>
            <p>{{ sale }}</p>
            <product-details :details="details"></product-details>            
            <p>Shipping: {{ shipping }}</p>
            <div class="color-box"
                v-for="(variant, index) in variants"
                :key="variant.variantId"
                :style="{backgroundColor: variant.variantColor}"
                @mouseover="updateProduct(index)">
            </div>
            <div class="sizes">
                <span v-for="size in sizes" :key="size" class="size-tag">
                    {{ size }}
                </span>
            </div>
            <button 
                v-on:click="addToCart"
                :disabled="!inStock"
                :class="{disabledButton: !inStock}"
            >Add to cart</button>
            <button v-on:click="subFromCart">Sub from cart</button>
        </div>
        
        <product-tabs 
          :reviews="reviews" 
          :shipping="shipping"
          :details="details">
        </product-tabs>
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
            reviews: [],
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
        },
        subFromCart() {
            this.$emit('sub-from-cart', this.variants[this.selectedVariant].variantId)
        },
        updateProduct(index) {
            this.selectedVariant = index
        }
    },
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview)
        })
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity > 0
        },
        sale() {
            if (this.onSale) {
                return `Распродажа! ${this.brand} ${this.product}`
            } else {
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