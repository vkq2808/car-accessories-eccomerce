import { CART_ACTION_TYPES } from '../actions/cartActions'

const initialState = {
    id: -1,
    cart_items: [],
    deleted_items: [],
    createdAt: new Date().toLocaleDateString('en-US'),
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
        case CART_ACTION_TYPES.GET_CART_ITEMS_FROM_STORAGE:
            return {
                ...state,
                items: action.payload
            }
        case CART_ACTION_TYPES.GET_CART:
            return {
                ...state,
                ...action.payload
            }
        case CART_ACTION_TYPES.UPDATE_CART:
            return {
                ...state,
                items: action.payload.items || state.items,
                deleted_items: action.payload.deleted_items || state.deleted_items
            }
        case CART_ACTION_TYPES.INIT_CART_ITEMS:
            return {
                ...state,
                items: []
            }
        case CART_ACTION_TYPES.REMOVE_CART_ITEM:
            return {
                ...state,
                items: state.items.filter(item => item.id !== action.payload)
            }
        default:
            return state
    }
}

export default cartReducer