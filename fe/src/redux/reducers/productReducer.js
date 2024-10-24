import { PRODUCT_ACTION_TYPES } from "../actions/productActions";

const initalState = {
    list: [],
    following: [],
    newProducts: [],
    popularProducts: [],
}

const productReducer = (state = initalState, action) => {
    switch (action.type) {
        case PRODUCT_ACTION_TYPES.GET_PRODUCTS:
            return {
                ...state,
                list: action.payload
            }
        case PRODUCT_ACTION_TYPES.FOLLOW_PRODUCT:
            return {
                ...state,
                following: [...state.following, action.payload]
            }
        case PRODUCT_ACTION_TYPES.UNFOLLOW_PRODUCT:
            return {
                ...state,
                following: state.following.filter(follow_product => follow_product.product.id !== action.payload.product.id)
            }
        case PRODUCT_ACTION_TYPES.GET_FOLLOWING_PRODUCTS:
            return {
                ...state,
                following: action.payload
            }
        case PRODUCT_ACTION_TYPES.GET_FOLLOWING_PRODUCTS_FROM_STORAGE:
            return {
                ...state,
                following: action.payload
            }
        case PRODUCT_ACTION_TYPES.INIT_FOLLOWING_PRODUCTS:
            return {
                ...state,
                following: []
            }
        case PRODUCT_ACTION_TYPES.GET_NEW_PRODUCTS:
            return {
                ...state,
                newProducts: action.payload
            }
        case PRODUCT_ACTION_TYPES.GET_POPULAR_PRODUCTS:
            return {
                ...state,
                popularProducts: action.payload
            }
        default:
            return state;
    }
}

export default productReducer;