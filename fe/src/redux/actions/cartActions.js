import { postDataAPI, getDataAPI, putDataAPI, deleteDataAPI } from '../../utils/fetchData'

export const CART_ACTION_TYPES = {
    ADD_TO_CART: "ADD_TO_CART",
    CLEAR_CART: "CLEAR_CART",
    GET_CART_ITEMS_FROM_STORAGE: "GET_CART_ITEMS_FROM_STORAGE",
    GET_CART: "GET_CART",
    UPDATE_CART: "UPDATE_CART",
    UPDATE_CART_ITEM: "UPDATE_CART_ITEM",
    REMOVE_CART_ITEM: "REMOVE_CART_ITEM",
    RETRIEVE_CART_ITEM: "RETRIEVE_CART_ITEM"
}

export const getCart = (token) => async (dispatch) => {
    try {
        const res = await getDataAPI('cart')
        if (res.status === 200) {
            dispatch({
                type: CART_ACTION_TYPES.GET_CART,
                payload: res.data
            })
        }
    } catch (err) {
        console.log(err)
    }
}

export const addProductAPI = ({ product, quantity, product_option }) => async (dispatch) => {
    try {
        const res = await postDataAPI('cart/add', { product, quantity, product_option })
        if (res.status === 200) {
            dispatch({ type: CART_ACTION_TYPES.GET_CART, payload: res.data })
        }
    } catch (err) {
        console.log(err)
    }
}

export const addProduct = ({ product, quantity, token, product_option }) => async (dispatch) => {
    try {
        if (token) {
            dispatch(addProductAPI({ product, quantity, product_option }))
        } else {
            dispatch({
                type: CART_ACTION_TYPES.ADD_TO_CART,
                payload: { product: product, quantity: quantity, product_option: product_option }
            })
        }
    } catch (err) {
        console.log(err)
    }
}


export const updateCartItemAPI = ({ cart_item, quantity, product_option }) => async (dispatch) => {
    try {
        const res = await putDataAPI(`cart/cart-item/update/${cart_item.id}`, { quantity, product_option })
        if (res.status === 200) {
            dispatch({ type: CART_ACTION_TYPES.GET_CART, payload: res.data })
        }
    } catch (err) {
        console.log(err)
    }
}

export const updateCartItem = ({ cart_item, quantity, token, product_option, new_product_option }) => async (dispatch) => {
    try {
        if (token) {
            dispatch(updateCartItemAPI({ cart_item, quantity, token, product_option: new_product_option || product_option }))
        } else {
            dispatch({
                type: CART_ACTION_TYPES.UPDATE_CART_ITEM,
                payload: { cart_item: cart_item, quantity: quantity, product_option: product_option, new_product_option: new_product_option }
            })
        }
    } catch (err) {
        console.log(err)
    }
}
export const removeCartItemAPI = ({ cart_item }) => async (dispatch) => {
    try {
        const res = await deleteDataAPI(`cart/cart-item/delete/${cart_item.id}`)
        dispatch({ type: CART_ACTION_TYPES.GET_CART, payload: res.data })
    } catch (err) {
        console.log(err)
    }
}

export const removeCartItem = ({ cart_item, token }) => async (dispatch) => {
    try {
        if (token) {
            dispatch(removeCartItemAPI({ cart_item }))
        }
        dispatch({
            type: CART_ACTION_TYPES.REMOVE_CART_ITEM,
            payload: { cart_item: cart_item }
        })
    } catch (err) {
        console.log(err)
    }
}

export const retrieveCartItem = ({ cart_item, token }) => async (dispatch) => {
    if (token) {
        dispatch({
            type: CART_ACTION_TYPES.RETRIEVE_CART_ITEM,
            payload: { cart_item: cart_item }
        })
        dispatch(addProductAPI({ product: cart_item.product, quantity: cart_item.quantity, product_option: cart_item.product_option }))

    } else {
        dispatch({
            type: CART_ACTION_TYPES.RETRIEVE_CART_ITEM,
            payload: { cart_item: cart_item }
        })
    }
}

export const updateCart = ({ token, cart_items }) => async (dispatch) => {
    try {
        const res = await putDataAPI('cart/update', { cartItems: cart_items })
        if (res.status === 200) {
            dispatch({
                type: CART_ACTION_TYPES.UPDATE_CART,
                payload: { cart_items: cart_items }
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
