import { postDataAPI, getDataAPI } from "../../utils/fetchData"
import { CART_ACTION_TYPES, getCart } from "./cartActions";
import { GLOBALTYPES } from "./globalTypes";
import { getFollowingProducts, PRODUCT_ACTION_TYPES } from "./productActions";

export const AUTH_ACTION_TYPES = {
    LOGOUT: "LOGOUT",
}

export const login = (data) => async (dispatch) => {
    try {
        dispatch({ type: GLOBALTYPES.LOADING, payload: true })

        const res = await postDataAPI("auth/login", data)

        if (res.status === 200) {

            dispatch({
                type: GLOBALTYPES.AUTH,
                payload: { token: "Bearer " + res.data.accessToken, user: res.data.user }
            })

            dispatch({
                type: GLOBALTYPES.USER_ROLE,
                payload: res.data.user.role
            })

            dispatch({ type: GLOBALTYPES.LOADING, payload: false })

            localStorage.setItem("firstLogin", true)
            localStorage.setItem("accessToken", "Bearer " + res.data.accessToken)
            localStorage.setItem("refreshToken", "Bearer " + res.data.refreshToken)

            dispatch({ type: GLOBALTYPES.SUCCESS_ALERT, payload: res.data.msg })
        }
        else {
            dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: res.data.msg })
            dispatch({ type: GLOBALTYPES.LOADING, payload: false })
        }
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ERROR_ALERT,
            payload: err.response?.data?.msg
        })
        dispatch({ type: GLOBALTYPES.LOADING, payload: false })
    }
}

export const regist = (data, setResult) => async (dispatch) => {
    try {
        dispatch({ type: GLOBALTYPES.LOADING, payload: true })

        const res = await postDataAPI("auth/regist", data)
        if (res.status === 200) {
            dispatch({ type: GLOBALTYPES.LOADING, payload: false })
            dispatch({ type: GLOBALTYPES.SUCCESS_ALERT, payload: res.data.msg })
            dispatch({ type: GLOBALTYPES.REDIRECTING, payload: true })
        } else {
            dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: res.data.msg })
            dispatch({ type: GLOBALTYPES.LOADING, payload: false })
        }
        setResult(res.data.msg)
    } catch (err) {
        setResult(err.response.data.msg)
        dispatch({
            type: GLOBALTYPES.ERROR_ALERT,
            payload: err.response.data.msg
        })
        dispatch({ type: GLOBALTYPES.LOADING, payload: false })
    }
}

export const verifyEmail = ({ token, setIsLoading, setResult }) => async (dispatch) => {
    try {
        setIsLoading(true);
        const res = await getDataAPI(`auth/verify-email/${token}`);
        console.log(res)
        setResult(res.data.msg);
        if (res.status === 201) {
            setIsLoading(false);
            dispatch({ type: GLOBALTYPES.SUCCESS_ALERT, payload: res.data.msg });
            dispatch({ type: GLOBALTYPES.REDIRECTING, payload: true });
        } else {
            setIsLoading(false);
            dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: res.data.msg });
        }
    } catch (err) {
        console.log(err)
        dispatch({ type: GLOBALTYPES.REDIRECTING, payload: true });
        dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: err.response.data.msg });
        setResult(err.response.data.msg);
        setIsLoading(false);
    }
}

export const logout = () => async (dispatch) => {
    try {
        localStorage.removeItem("firstLogin")
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        localStorage.removeItem("cart_items")
        localStorage.removeItem("following_items")
        dispatch({ type: AUTH_ACTION_TYPES.LOGOUT })
        dispatch({ type: PRODUCT_ACTION_TYPES.GET_FOLLOWING_PRODUCTS_FROM_STORAGE, payload: [] })
        dispatch({ type: CART_ACTION_TYPES.GET_CART_ITEMS_FROM_STORAGE, payload: [] })
        window.location.href = "/"
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ERROR_ALERT,
            payload: err.response.data.msg
        })
    }
}
export const getUserInfo = () => async (dispatch) => {

    const firstLogin = localStorage.getItem("firstLogin")

    if (firstLogin) {
        const accessToken = localStorage.getItem("accessToken")
        try {
            const res = await getDataAPI("user/get-user-info", accessToken)

            dispatch({
                type: GLOBALTYPES.AUTH,
                payload: { token: accessToken, user: res.data }
            })

            dispatch({
                type: GLOBALTYPES.USER_TYPE,
                payload: res.data.user.role
            })

        } catch (err) {
            if (err?.response?.status === 401) {
                dispatch(refreshToken())
            } else {
                dispatch({
                    type: GLOBALTYPES.ERROR_ALERT,
                    payload: err?.response?.data?.msg
                })
            }
        }
    }
}

const refreshToken = () => async (dispatch) => {
    const refreshToken = localStorage.getItem("refreshToken")
    try {
        var res = await postDataAPI("auth/refresh-token", refreshToken, null)

        const accessToken = "Bearer " + res.data.accessToken

        localStorage.setItem("accessToken", accessToken)

        res = await postDataAPI("auth/get-user-info", null, accessToken)

        dispatch({
            type: GLOBALTYPES.AUTH,
            payload: { token: accessToken, user: res.data.user }
        })

        dispatch({
            type: GLOBALTYPES.USER_TYPE,
            payload: res.data.user.role
        })

    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ERROR_ALERT,
            payload: err.response.data.msg
        })
    }
}

export const resetPassword = (data) => async (dispatch) => {
    try {
        dispatch({ type: GLOBALTYPES.LOADING, payload: true })

        const res = await postDataAPI("auth/reset-password", data, localStorage.getItem("accessToken"))
        if (res.status === 200) {
            dispatch({ type: GLOBALTYPES.SUCCESS_ALERT, payload: res.data.msg })
            dispatch({ type: GLOBALTYPES.REDIRECTING, payload: true })
        } else {
            dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: res.data.msg })
        }
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ERROR_ALERT,
            payload: err.response.data.msg
        })
        dispatch({ type: GLOBALTYPES.LOADING, payload: false })
    }
}

export const changePassword = (data) => async (dispatch) => {
    try {
        dispatch({ type: GLOBALTYPES.LOADING, payload: true })

        const res = await postDataAPI("auth/change-password", data)
        if (res.status === 200) {
            dispatch({ type: GLOBALTYPES.LOADING, payload: false })
            dispatch({ type: GLOBALTYPES.SUCCESS_ALERT, payload: res.data.msg })
            dispatch({ type: GLOBALTYPES.AUTH, payload: { user: res.data.user } })
            dispatch({ type: GLOBALTYPES.REDIRECTING, payload: true })
        } else {
            dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: res.data.msg })
            dispatch({ type: GLOBALTYPES.LOADING, payload: false })
        }
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ERROR_ALERT,
            payload: err.response.data.msg
        })
        dispatch({ type: GLOBALTYPES.LOADING, payload: false })
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
                payload: err.response.data.msg
            })
        }
    }
}