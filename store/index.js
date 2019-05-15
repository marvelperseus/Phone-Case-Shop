import Vue from 'vue'
import Vuex from 'vuex'
import cosmic from '../plugins/cosmic'

const createStore = () => {
  return new Vuex.Store({
    state: {
      cartTotal: 0,
      cart: {},
      products: [],
      globals: []
    },
    mutations: {
      setProducts (state, products) {
        state.products = products
      },
      setGlobals (state, globals) {
        state.globals = globals
      },
      clearCart (state) {
        state.cart = {}
        state.cartTotal = 0
      },
      removeItem (state, item) {
        state.cartTotal -= item.count
        Vue.delete(state.cart, item.slug)
      },
      addToCart (state, item) {
        state.cartTotal++
        if (item.slug in state.cart) {
          state.cart[item.slug].count++
        } else {
          let stateItem = Object.assign({}, item)
          stateItem.count = 1
          state.cart[item.slug] = stateItem
        }
      }
    },
    actions: {
      nuxtServerInit ({ dispatch }, { req }) {
        return dispatch('getGlobals')
      },
      getProducts({ commit, state }) {
        const params = {
          type_slug: 'products'
        }
        return cosmic.getObjectsByType(params).then(data => {
          commit('setProducts', data.objects)
        }).catch(err => {
          console.log(err)
        })
      },
      getGlobals({ commit, state }) {
        const params = {
          type_slug: 'globals'
        }
        return cosmic.getObjectsByType(params).then(data => {
          commit('setGlobals', data.objects)
        }).catch(err => {
          console.log(err)
        })
      }
    },
    getters: {
      products: state => state.products,
      cart: state => state.cart
    }
  })
}

export default createStore
