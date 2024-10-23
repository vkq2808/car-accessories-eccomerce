import { PRODUCT_ACTION_TYPES } from "../actions/productActions";

const initalState = {
    list: [],
    following: [],
    follwing_synced: false
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
                following: [...state.following, action.payload],
                follwing_synced: false
            }
        case PRODUCT_ACTION_TYPES.GET_FOLLOWING_PRODUCTS:
            return {
                ...state,
                following: action.payload,
                follwing_synced: true
            }
        default:
            return state;
    }
}

export default productReducer;