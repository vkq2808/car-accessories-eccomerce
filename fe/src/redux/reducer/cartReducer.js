import { CART_ACTION_TYPES } from '../action/cartAction'

const initialState = {
    items: []
}

const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case CART_ACTION_TYPES.ADD_TO_CART:
            return {
                ...state,
                items: [...state.items, action.payload]
            }
        case CART_ACTION_TYPES.REMOVE_FROM_CART:
            return {
                ...state,
                items: state.items.filter(item => item.id !== action.payload.id)
            }
        case CART_ACTION_TYPES.CLEAR_CART:
            return {
                ...state,
                items: []
            }
        case CART_ACTION_TYPES.UPDATE_CART_ITEMS:
            return {
                ...state,
                items: action.payload
            }
        case CART_ACTION_TYPES.SET_CART:
            return {
                items: action.payload
            }
        case CART_ACTION_TYPES.GET_CART:
            return state
        default:
            return state
    }
}

export default cartReducer