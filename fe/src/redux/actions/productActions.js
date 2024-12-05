import { getDataAPI, postDataAPI } from "../../utils/fetchData"
import { GLOBALTYPES } from './globalTypes';
import { CART_ACTION_TYPES } from './cartActions';


export const PRODUCT_ACTION_TYPES = {
    GET_PRODUCTS: "GET_PRODUCTS",
    GET_NEW_PRODUCTS: "GET_NEW_PRODUCTS",
    GET_TRENDING_PRODUCTS: "GET_TRENDING_PRODUCTS",
    SEARCH_PRODUCTS: "SEARCH_PRODUCTS",
    CLEAR_SEARCH_PRODUCTS: "CLEAR_SEARCH_PRODUCTS",
    HEADER_SEARCH_PRODUCTS: "HEADER_SEARCH_PRODUCTS",
    CLEAR_HEADER_SEARCH_PRODUCTS: "CLEAR_HEADER_SEARCH_PRODUCTS",
    FOLLOW_PRODUCT: "FOLLOW_PRODUCT",
    UNFOLLOW_PRODUCT: "UNFOLLOW_PRODUCT",
    GET_FOLLOWING_PRODUCTS: "GET_FOLLOWING_PRODUCTS",
    GET_FOLLOWING_PRODUCTS_FROM_STORAGE: "GET_FOLLOWING_PRODUCTS_FROM_STORAGE",
    INIT_FOLLOWING_PRODUCTS: "INIT_FOLLOWING_PRODUCTS",
    UPDATE_FOLLOWING_PRODUCTS: "UPDATE_FOLLOWING_PRODUCTS",
}

export const searchProducts = ({ searchTerm = "", category_path, category_id = 0, page = 1, limit = 12 }) => async (dispatch) => {
    try {
        let queriesArr = [];
        queriesArr.push(searchTerm ? 'searchTerm=' + searchTerm + '&' : '');
        queriesArr.push(category_id ? 'category_id=' + category_id + '&' : 'category_path=' + category_path + '&');

        let queries = queriesArr.join('');

        const res = await getDataAPI(`product/search?${queries}page=${page}&limit=${limit}`)
        if (res.status !== 200) {
            dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: res.data.message })
            return;
        }
        dispatch({
            type: PRODUCT_ACTION_TYPES.SEARCH_PRODUCTS,
            payload: res.data.result
        })
    } catch (err) {
        console.log(err)
        dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: err?.response?.data.message || "Lỗi server" })
    }
}

export const headerSearchProducts = ({ searchTerm = "", category_path, category_id = 0, page = 1, limit = 6 }) => async (dispatch) => {
    try {
        let queriesArr = [];
        queriesArr.push(searchTerm ? 'searchTerm=' + searchTerm + '&' : '');
        queriesArr.push(category_id ? 'category_id=' + category_id + '&' : 'category_path=' + category_path + '&');

        let queries = queriesArr.join('');

        const res = await getDataAPI(`product/search?${queries}page=${page}&limit=${limit}`)
        if (res.status !== 200) {
            dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: res.data.message })
            return;
        }

        dispatch({
            type: PRODUCT_ACTION_TYPES.HEADER_SEARCH_PRODUCTS,
            payload: res.data.result
        })
    } catch (err) {
        console.log(err)
        dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: err?.response?.data.message || "Lỗi server" })
    }
}

export const getProductsBycategory_id = ({ category_id, page = 1, limit = 12 }) => async (dispatch) => {
    try {
        let queriesArr = [];
        queriesArr.push(category_id ? 'category_id=' + category_id + '&' : '');

        let queries = queriesArr.join('');

        const res = await getDataAPI(`product/search?${queries}page=${page}&limit=${limit}`)
        if (res.status !== 200) {
            dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: res.data.message })
            return;
        }
        dispatch({
            type: PRODUCT_ACTION_TYPES.SEARCH_PRODUCTS,
            payload: res.data.result
        })
    } catch (err) {
        console.log(err)
        dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: err?.response?.data.message || "Lỗi server" })
    }
}

export const getProducts = () => async (dispatch) => {
    try {
        const res = await getDataAPI("product")
        if (res.status !== 200) {
            dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: res.data.message })
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

export const getNewProducts = () => async (dispatch) => {
    try {
        const searchTerm = ''
        const category_id = -1
        const page = 1
        const limit = 6
        const res = await getDataAPI(`product/search?searchTerm=${searchTerm}&category_id=${category_id}&page=${page}&limit=${limit}`)
        if (res.status !== 200) {
            dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: res.data.message })
            return;
        }
        dispatch({
            type: PRODUCT_ACTION_TYPES.GET_NEW_PRODUCTS,
            payload: res.data.result.products
        })
    } catch (err) {
        console.log(err)
    }
}

export const getTrendingProducts = () => async (dispatch) => {
    try {
        const searchTerm = ''
        const category_id = -1
        const page = 1
        const limit = 4
        const res = await getDataAPI(`product/search?searchTerm=${searchTerm}&category_id=${category_id}&page=${page}&limit=${limit}`)
        if (res.status !== 200) {
            dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: res.data.message })
            return;
        }
        dispatch({
            type: PRODUCT_ACTION_TYPES.GET_TRENDING_PRODUCTS,
            payload: res.data.result.products
        })
    } catch (err) {
        console.log(err)
    }
}

export const getFollowingProducts = (oken) => async (dispatch) => {
    try {
        const res = await getDataAPI('follow')
        if (res.status !== 200) {
            dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: res.data.message })
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

export const followProduct = ({ token, product }) => async (dispatch) => {
    try {
        const res = await postDataAPI('follow/follow', { product }, token)
        if (res.status !== 200) {
            dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: res.data.message })
            return;
        }
        dispatch(getFollowingProducts(token))
        dispatch({ type: GLOBALTYPES.SUCCESS_ALERT, payload: res.data.message })
    } catch (err) {
        console.log(err)
    }
}

export const unfollowProduct = ({ token, product }) => async (dispatch) => {
    try {
        const res = await postDataAPI(`follow/unfollow`, { product }, token)
        if (res.status !== 200) {
            dispatch({ type: GLOBALTYPES.ERROR_ALERT, payload: res.data.message })
            return;
        }
        dispatch(getFollowingProducts(token))
    } catch (err) {
        console.log(err)
    }
}

export const SyncLocalCartAndFollowingProductDetail = ({ cart_items, followings }) => async (dispatch) => {
    let updatedCartItems = [];
    cart_items.forEach(item => async () => {
        const productDetail = await getDataAPI(`product/detail/${item.product.path}`)
            .then(res => {
                if (res.status === 200) {
                    return res.data.product;
                }
            })
            .catch(err => console.log(err));
        updatedCartItems.push({ ...item, product: productDetail });
    });

    let updatedFollowingItems = [];
    followings.forEach(item => async () => {
        const productDetail = getDataAPI(`product/${item.product.path}`)
            .then(res => {
                if (res.status === 200) {
                    return res.data.product;
                }
            })
            .catch(err => console.log(err));
        updatedFollowingItems.push({ ...item, product: productDetail });
    });

    // Chỉ dispatch nếu có sự thay đổi
    if (JSON.stringify(updatedCartItems) !== JSON.stringify(cart_items)) {
        dispatch({ type: CART_ACTION_TYPES.UPDATE_CART, payload: updatedCartItems });
    }

    if (JSON.stringify(updatedFollowingItems) !== JSON.stringify(followings)) {
        dispatch({ type: PRODUCT_ACTION_TYPES.UPDATE_FOLLOWING_PRODUCTS, payload: updatedFollowingItems });
    }
}