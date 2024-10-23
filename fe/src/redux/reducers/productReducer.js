import { PRODUCT_ACTION_TYPES } from "../actions/productActions";

const initalState = {
    list: [],
<<<<<<< HEAD
    following: [],
    follwing_synced: false
=======
>>>>>>> 0883aba932a12d174e483cb7df379f0094262ded
}

const productReducer = (state = initalState, action) => {
    switch (action.type) {
        case PRODUCT_ACTION_TYPES.GET_PRODUCTS:
            return {
                ...state,
                list: action.payload
            }
<<<<<<< HEAD
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
=======
>>>>>>> 0883aba932a12d174e483cb7df379f0094262ded
        default:
            return state;
    }
}

export default productReducer;