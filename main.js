Vue.component('product', {
  props: {
    premium: {
      type: Boolean,
      required: true
    }
  },
  template: `
  <div class="product">

    <div class="product image">
      <img v-bind:src="image">
    </div>

  <div class="product-info">
    <h1> {{ title }} </h1>
    <p v-if="inStock">In stock!</p>
    <p v-else>Out of stock!</p>
    <p>Shipping: {{ shipping }}</p>

    <ul>
      <li v-for="detail in details">{{ detail }}</li>
    </ul>

    <div v-for="(variant, index) in variants" 
      :key="variant.variantId"
      class="color-box"
      :style="{ backgroundColor: variant.variantColor }"
      @mouseover="updateProduct(index)">
    </div>

    <button v-on:click="addToCart" 
      :disabled="!inStock"
      :class="{disabledButton: !inStock }">
      Add to cart
    </button>
  </div>

  <div>
        <h2>Reviews</h2>
        <p v-if="!reviews.length">There are no reviews yet.</p>
        <ul>
          <li v-for="review in reviews">
          <p>{{ review.name }}</p>
          <p>Rating: {{ review.rating }}</p>
          <p>{{ review.review }}</p>
          <p>{{ review.yes }}</p>
          <p>{{ review.no }}</p>
          </li>
        </ul>
  </div>

  <product-review @review-submitted="addReview"></product-review>
</div>
  `,
  data() {
    return {
      brand: 'Vue Mastery',
      product: 'Socks',
      selectedVariant: 0,
      details: ["80% cotton", "20% polyester", "Gender neutral"],
      variants: [
        {
          variantId: 2234,
          variantColor: "green",
          variantImage: './assets/vmSocks-green.jpg',
          variantQuantity: 10
        },
        {
          variantId: 2235,
          variantColor: "blue",
          variantImage: './assets/vmSocks-blue.jpg',
          variantQuantity: 0
        }
      ],
      reviews: []
    }
  },
  methods: {
    // method with function
    addToCart: function () {
      this.$emit( 'add-to-cart', this.variants[this.selectedVariant].variantId )
    },
    // method whitout function
    updateProduct(index) {
      this.selectedVariant = index
      console.log(index)
    },
    addReview(productReview) {
      this.reviews.push(productReview)
    }
  },
  computed: {
    title() {
      return this.brand + '' + this.product
    },
    image() {
      return this.variants[this.selectedVariant].variantImage
    },
    inStock() {
      return this.variants[this.selectedVariant].variantQuantity
    },
    shipping() {
      if ( this.premium ) {
        return "Free"
      }
      return 2.99
    }
  }
})

Vue.component('product-review', {
  template: `
    <form class="review-form" @submit.prevent="onSubmit">
      <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name" placeholder="name">
      </p>
      
      <p>
        <label for="review">Review:</label>      
        <textarea id="review" v-model="review"></textarea>
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
        <label for="question">Would you recommend this product?</label>
        <input type="radio" id="yes" v-model="yes" value="I recommend this product" v-model="picked">
        <label for="yes">Yes</label>

        <input type="radio" id="no" v-model="no" value="Do not recommend this product" v-model="picked">
        <label for="no">No</label>
      </p>

      <p v-if="errors.length">
        <b>Please correct the following error(s):</b>
        <ul>
          <li v-for="error in errors">{{ error }}</li>
        </ul>
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
      yes: null,
      no: null,
      errors: []
    }
  },
  methods: {
    onSubmit() {
      if ( this.name && this.review && this.rating && (this.yes || this.no) ) {
      let productReview = {
        name: this.name,
        review: this.review,
        rating: this.rating,
        yes: this.yes,
        no: this.no
      }
      this.$emit('review-submitted', productReview)
      this.name = null
      this.review = null
      this.rating = null
      this.yes = null
      this.no = null
      } else {
        if ( !this.name ) this.errors.push("Name required.")
        if ( !this.review ) this.errors.push("Review required.")
        if ( !this.rating ) this.errors.push("Rating required.")
        if ( !this.yes && !this.no ) this.errors.push("Question required")
      }
    }
  }
})

var app = new Vue({
  el:'#app',
  data: {
    premium: true,
    cart: []
  },
  methods: {
    updateCart(id) {
      this.cart.push(id)
    }
  }
})