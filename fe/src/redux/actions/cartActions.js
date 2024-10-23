import { postDataAPI, getDataAPI, putDataAPI } from '../../utils/fetchData'
import { useNavigate } from 'react-router-dom'

export const CART_ACTION_TYPES = {
    ADD_TO_CART: "ADD_TO_CART",
    REMOVE_FROM_CART: "REMOVE_FROM_CART",
    CLEAR_CART: "CLEAR_CART",
    GET_CART_ITEMS_FROM_STORAGE: "GET_CART_ITEMS_FROM_STORAGE",
    GET_CART: "GET_CART",
    SYNC_CART: "SYNC_CART",
    NOT_SYNC_CART: "NOT_SYNC_CART"
}

export const getCart = (token) => async (dispatch) => {
    try {
        const res = await getDataAPI('cart', token)
        if (res.status === 200 && res.data.cart.cart_items) {
            console.log(res.data.cart)
            dispatch({
                type: CART_ACTION_TYPES.GET_CART,
                payload: res.data.cart.cart_items
            })
            return res.data.cart
        }
    } catch (err) {
        if (err?.res?.status === 401) {
            const nav = useNavigate()
            nav('/auth/login')
        }
        console.log(err)
    }
}

export const getCartFromStorage = () => async (dispatch) => {
    try {
        const cartItems = JSON.parse(localStorage.getItem('cart_items'))
        if (cartItems) {
            dispatch({
                type: CART_ACTION_TYPES.GET_CART_ITEMS_FROM_STORAGE,
                payload: cartItems
            })
        }
    } catch (err) {
        console.log(err)
    }
}

export const addProductToCart = (product, quantity, token) => async (dispatch) => {
    try {
        const res = await postDataAPI('cart/add-product', { product, quantity }, token)
        if (res.status === 200) {
            dispatch(getCart(token))
        }
    } catch (err) {
        console.log(err)
    }
}

export const updateCart = ({ token, cart_items }) => async (dispatch) => {
    try {
        const res = await putDataAPI('cart/update', { cartItems: cart_items }, token)
        if (res.status === 200) {
            dispatch({
                type: CART_ACTION_TYPES.GET_CART_ITEMS_FROM_STORAGE,
                payload: cart_items
            })
        }
    } catch (err) {
        console.log(err)
    }
}

export const removeFromCart = () => async (dispatch) => {
}

export const clearCart = () => async (dispatch) => {
}
