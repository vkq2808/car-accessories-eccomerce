import { postDataAPI, getDataAPI } from "../../utils/fetchData"
import { CART_ACTION_TYPES, getCart } from "./cartActions";
import { GLOBALTYPES } from "./globalTypes";
import { getFollowingProducts, PRODUCT_ACTION_TYPES } from "./productActions";

export const AUTH_ACTION_TYPES = {
    LOGOUT: "LOGOUT",
}

export const updateToken = (newToken) => async (dispatch) => {
    dispatch({
        type: GLOBALTYPES.AUTH,
        payload: { token: newToken }
    })
}

export const login = (data) => async (dispatch) => {
    try {

        const res = await postDataAPI("auth/login", data)

        if (res.status === 200) {

            console.log(res.data)

            dispatch({
                type: GLOBALTYPES.AUTH,
                payload: { token: "Bearer " + res.data.access_token, user: res.data.user, role: res.data.user.role }
            })

            dispatch({ type: CART_ACTION_TYPES.CLEAR_CART })
            dispatch({ type: PRODUCT_ACTION_TYPES.INIT_FOLLOWING_PRODUCTS })

            localStorage.setItem("firstLogin", true)
            localStorage.setItem("access_token", "Bearer " + res.data.access_token)
            localStorage.setItem("refresh_token", "Bearer " + res.data.refresh_token)

            dispatch({ type: GLOBALTYPES.SUCCESS_ALERT, payload: res.data.message })
        }
        else {
            dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: res.data.message })
        }
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ERROR_ALERT,
            payload: err.response.data.message
        })
    }
}

export const regist = (data, setResult) => async (dispatch) => {
    try {


        const res = await postDataAPI("auth/regist", data)
        if (res.status === 200) {

            dispatch({ type: GLOBALTYPES.SUCCESS_ALERT, payload: res.data.message })
            dispatch({ type: GLOBALTYPES.REDIRECTING, payload: true })
        } else {
            dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: res.data.message })

        }
        setResult(res.data.message)
    } catch (err) {
        setResult(err.response.data.message)
        dispatch({
            type: GLOBALTYPES.ERROR_ALERT,
            payload: err.response.data.message
        })

    }
}

export const verifyEmail = ({ token, setIsLoading, setResult }) => async (dispatch) => {
    try {
        setIsLoading(true);
        const res = await getDataAPI(`auth/verify-email/${token}`);
        console.log(res)
        setResult(res.data.message);
        if (res.status === 201) {
            setIsLoading(false);
            dispatch({ type: GLOBALTYPES.SUCCESS_ALERT, payload: res.data.message });
            dispatch({ type: GLOBALTYPES.REDIRECTING, payload: true });
        } else {
            setIsLoading(false);
            dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: res.data.message });
        }
    } catch (err) {
        console.log(err)
        dispatch({ type: GLOBALTYPES.REDIRECTING, payload: true });
        dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: err.response.data.message });
        setResult(err.response.data.message);
        setIsLoading(false);
    }
}

export const logout = () => async (dispatch) => {
    try {
        localStorage.removeItem("firstLogin")
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        localStorage.removeItem("cart")
        localStorage.removeItem("following_items")
        dispatch({ type: AUTH_ACTION_TYPES.LOGOUT })
        dispatch({ type: PRODUCT_ACTION_TYPES.INIT_FOLLOWING_PRODUCTS })
        dispatch({ type: CART_ACTION_TYPES.CLEAR_CART })
    } catch (err) {
        console.log(err)
        dispatch({
            type: GLOBALTYPES.ERROR_ALERT,
            payload: err
        })
    }
}
export const getUserInfo = () => async (dispatch) => {
    const access_token = localStorage.getItem("access_token")
    try {
        const res = await getDataAPI("user/get-user-info", access_token)

        dispatch({
            type: GLOBALTYPES.AUTH,
            payload: { user: res.data }
        })
    } catch (err) {
        localStorage.removeItem("access_token")
    }
}

export const requestResetPassword = (data, setResult) => async (dispatch) => {
    try {
        const res = await postDataAPI("auth/request-reset-password", data, localStorage.getItem("access_token"))
        if (res.status === 200) {
            dispatch({ type: GLOBALTYPES.SUCCESS_ALERT, payload: res.data.message })
            setResult(res.data.message)
        } else {
            setResult(res.data.message)
            dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: res.data.message })
        }
        dispatch({ type: GLOBALTYPES.REDIRECTING, payload: true })
    } catch (err) {
        setResult(err.response.data.message)
        dispatch({
            type: GLOBALTYPES.ERROR_ALERT,
            payload: err.response.data.message
        })
    }
}

export const resetPassword = (data, setResult) => async (dispatch) => {
    try {
        const res = await postDataAPI("auth/reset-password", data)
        if (res.status === 200) {
            dispatch({ type: GLOBALTYPES.SUCCESS_ALERT, payload: res.data.message })
            dispatch({ type: GLOBALTYPES.REDIRECTING, payload: true })
        } else {
            dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: res.data.message })
        }
        setResult(res.data.message)
    } catch (err) {
        setResult(err.response.data.message)
        dispatch({
            type: GLOBALTYPES.ERROR_ALERT,
            payload: err.response.data.message
        })

    }
}

export const syncCartAndFollowing = (cart_items, following_items, token) => async (dispatch) => {
    if (token) {
        try {
            await postDataAPI("cart/sync", { cart_items }, token)
            dispatch(getCart(token))
            await postDataAPI("follow/sync-follow", { following_items }, token)
            dispatch(getFollowingProducts(token))
        } catch (err) {
            dispatch({
                type: GLOBALTYPES.ERROR_ALERT,
                payload: err.response.data.message
            })
        }
    }
}