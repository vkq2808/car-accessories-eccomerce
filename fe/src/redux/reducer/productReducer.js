import { PRODUCT_ACTION_TYPES } from "../action/productAction";

const initalState = {
    products: [],
}

const productReducer = (state = initalState, action) => {
    switch (action.type) {
        case PRODUCT_ACTION_TYPES.GET_PRODUCTS:
            return {
                ...state,
                products: action.payload
            }
        default:
            return state;
    }
}

export default productReducer;