import { getDataAPI } from "../../utils/fetchData"
import { GLOBALTYPES } from './globalTypes';


export const PRODUCT_ACTION_TYPES = {
    GET_PRODUCTS: "GET_PRODUCTS"
}

export const getProducts = () => async (dispatch) => {
    try {
        console.log("test")
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