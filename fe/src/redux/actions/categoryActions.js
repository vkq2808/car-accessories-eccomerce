import { getDataAPI } from "../../utils/fetchData";
import { GLOBALTYPES } from "./globalTypes";


export const CATEGORY_ACTION_TYPES = {
<<<<<<< HEAD
    GET_CATEGORIES: "GET_CATEGORIES",
=======
    SET_CATEGORIES: "SET_CATEGORIES",
>>>>>>> 0883aba932a12d174e483cb7df379f0094262ded
    ADD_CATEGORY: "ADD_CATEGORY",
    UPDATE_CATEGORY: "UPDATE_CATEGORY",
    DELETE_CATEGORY: "DELETE_CATEGORY"
}

export const getCategories = () => async (dispatch) => {
    try {
        const res = await getDataAPI("category")
        if (res.status !== 200) {
            dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: res.data.msg })
            return;
        }
        dispatch({
<<<<<<< HEAD
            type: CATEGORY_ACTION_TYPES.GET_CATEGORIES,
=======
            type: CATEGORY_ACTION_TYPES.SET_CATEGORIES,
>>>>>>> 0883aba932a12d174e483cb7df379f0094262ded
            payload: res.data.categories
        })
    } catch (err) {
        console.log(err)
    }
}