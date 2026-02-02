let app = new Vue({
    el: '#app', // Свойство для подключения экземпляра Vue к элементу страницы
    data: {
        product: "Socks", // Место для хранения данных в Vue
        brand: 'Vue Mastery',
        description: "A pair of warm, fuzzy socks", // Практическая работа №1 (добавление ключа к экземпляру)
        selectedVariant: 0,
        altText: "A pair of socks",
        link: "https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks", // Практическая работа №2 (добавление ссылки на страницу)
        onSale: true, // Практическая работа №3
        details: ['80% cotton', '20% polyester', 'Gender-neutral'], // массив details
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
        cart: 0,
    },
    methods: {
        addToCart() {
            this.cart += 1
        },
        updateProduct(index) {
            this.selectedVariant = index
        },
        subToCart(){
            if (this.cart > 0) {
                this.cart -= 1
            } // Практическая работа №5 (Добавление кнопки вычета)
        }
        
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
            return this.daw
        }
    }

})

// Vue - это реактивный фреймворк, данные связаны со всеми местами веб-страницы, в которых есть ссылки на эти данные.

