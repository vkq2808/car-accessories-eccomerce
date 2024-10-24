import { getDataAPI, postDataAPI, putDataAPI, deleteDataAPI } from "../../utils/fetchData"
import { GLOBALTYPES } from './globalTypes';


export const PRODUCT_ACTION_TYPES = {
    GET_PRODUCTS: "GET_PRODUCTS",
    FOLLOW_PRODUCT: "FOLLOW_PRODUCT",
    UNFOLLOW_PRODUCT: "UNFOLLOW_PRODUCT",
    GET_FOLLOWING_PRODUCTS: "GET_FOLLOWING_PRODUCTS",
    GET_FOLLOWING_PRODUCTS_FROM_STORAGE: "GET_FOLLOWING_PRODUCTS_FROM_STORAGE",
    INIT_FOLLOWING_PRODUCTS: "INIT_FOLLOWING_PRODUCTS",
    UPDATE_FOLLOWING_PRODUCTS: "UPDATE_FOLLOWING_PRODUCTS",
    GET_NEW_PRODUCTS: "GET_NEW_PRODUCTS",
    GET_POPULAR_PRODUCTS: "GET_POPULAR_PRODUCTS",
}

export const getProducts = () => async (dispatch) => {
    try {
        const res = await getDataAPI("product")
        if (res.status !== 200) {
            dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: { error: res.data.msg } })
            return;
        }
        dispatch({
            type: PRODUCT_ACTION_TYPES.GET_PRODUCTS,
            payload: res.data.products
        })
    } catch (err) {
        console.log(err)
    }
}

export const followProduct = ({ token, product }) => async (dispatch) => {
    try {
        const res = await postDataAPI('follow', { product }, token)
        if (res.status !== 200) {
            dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: res.data.msg })
            return;
        }
        dispatch(getFollowingProducts(token))
        dispatch({ type: GLOBALTYPES.SUCCESS_ALERT, payload: res.data.msg })
    } catch (err) {
        console.log(err)
    }
}

export const getFollowingProducts = (token) => async (dispatch) => {
    try {
        const res = await getDataAPI('follow', token)
        if (res.status !== 200) {
            dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: res.data.msg })
            return;
        }
        dispatch(({
            type: PRODUCT_ACTION_TYPES.GET_FOLLOWING_PRODUCTS,
            payload: res.data.products
        }))
    } catch (err) {
        console.log(err)
    }
}

export const unfollowProduct = ({ token, product }) => async (dispatch) => {
    try {
        const res = await deleteDataAPI(`follow/${product.id}`, token)
        if (res.status !== 200) {
            dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: res.data.msg })
            return;
        }
        dispatch(getFollowingProducts(token))
    } catch (err) {
        console.log(err)
    }
}