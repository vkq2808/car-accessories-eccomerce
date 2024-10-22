import { postDataAPI, getDataAPI } from "../../utils/fetchData"
import { GLOBALTYPES } from "./globalTypes";

export const AUTH_ACTION_TYPES = {
    AUTH: "AUTH"
}

const REGIST_SUCESS = "Email sent to verify email";

export const login = (data) => async (dispatch) => {
    try {
        dispatch({ type: GLOBALTYPES.LOADING, payload: true })

        const res = await postDataAPI("auth/login", data)

        if (res.data.msg === "Login success") {

            dispatch({
                type: GLOBALTYPES.AUTH,
                payload: { token: "Bearer " + res.data.accessToken, user: res.data.user }
            })

            dispatch({
                type: GLOBALTYPES.USER_ROLE,
                payload: res.data.user.role
            })

            dispatch({ type: GLOBALTYPES.LOADING, payload: false })

            localStorage.setItem("isLoggedIn", true)
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

export const regist = (data) => async (dispatch) => {
    try {
        dispatch({ type: GLOBALTYPES.LOADING, payload: true })

        const res = await postDataAPI("auth/regist", data)
        if (res.data.msg === REGIST_SUCESS) {

            dispatch({ type: GLOBALTYPES.LOADING, payload: false })
            dispatch({ type: GLOBALTYPES.SUCCESS_ALERT, payload: res.data.msg })
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

export const verifyEmail = ({ token, setIsLoading, setResult }) => async (dispatch) => {
    try {
        setIsLoading(true);
        const res = await getDataAPI(`auth/verify-email/${token}`);
        setResult(res.data.msg);
        if (res.data.msg === "Email verified successfully") {
            setIsLoading(false);
            dispatch({ type: GLOBALTYPES.SUCCESS_ALERT, payload: res.data.msg });
        } else {
            setIsLoading(false);
            dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: res.data.msg });
        }
    } catch (err) {
        setResult(err.response.data.msg);
        setIsLoading(false);
        dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: err.response.data.msg });
    }
}

export const logout = () => async (dispatch) => {
    try {
        localStorage.removeItem("isLoggedIn")
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        window.location.href = "/"
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ERROR_ALERT,
            payload: err.response.data.msg
        })
    }
}
export const getUserInfo = () => async (dispatch) => {

    const isLoggedIn = localStorage.getItem("isLoggedIn")

    if (isLoggedIn) {
        const accessToken = localStorage.getItem("accessToken")
        try {
            const res = await postDataAPI("auth/get-user-info", null, accessToken)
            dispatch({
                type: GLOBALTYPES.AUTH,
                payload: { token: accessToken, user: res.data.user }
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
        var res = await postDataAPI("auth/refresh-token", null, refreshToken)

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
        if (res.data.msg === "Email sent to reset password") {
            dispatch({ type: GLOBALTYPES.LOADING, payload: false })
            dispatch({ type: GLOBALTYPES.SUCCESS_ALERT, payload: res.data.msg })
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

export const changePassword = (data) => async (dispatch) => {
    try {
        dispatch({ type: GLOBALTYPES.LOADING, payload: true })

        const res = await postDataAPI("auth/change-password", data)
        if (res.data.msg === "Password changed successfully") {
            dispatch({ type: GLOBALTYPES.LOADING, payload: false })
            dispatch({ type: GLOBALTYPES.SUCCESS_ALERT, payload: res.data.msg })
            dispatch({ type: GLOBALTYPES.AUTH, payload: { user: res.data.user } })
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
