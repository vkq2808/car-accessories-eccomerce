import { PRODUCT_ACTION_TYPES } from "../actions/productActions";

const initalState = {
    list: [],
}

const productReducer = (state = initalState, action) => {
    switch (action.type) {
        case PRODUCT_ACTION_TYPES.GET_PRODUCTS:
            return {
                ...state,
                list: action.payload
            }
        default:
            return state;
    }
}

export default productReducer;