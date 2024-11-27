import { ORDER_ACTION_TYPES } from "../actions/orderActions";

export const ORDER_STATUS = {
  EMPTY: "EMPTY",
  PENDING: "PENDING",
  CANCELLED: "CANCELLED",
  PROCESSING: "PROCESSING",
  NONE: "NONE",
}
const initialState = {
};



const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case ORDER_ACTION_TYPES.CREATE_ORDER:
      return {
        ...action.payload,
        ...state,
        status: ORDER_STATUS.EMPTY
      }
    case ORDER_ACTION_TYPES.GET_ORDER:
      return {
        ...state,
        ...action.payload
      }
    case ORDER_ACTION_TYPES.ADD_ORDER_ITEM:
      let new_order_items = [...(state.order_items ?? []), action.payload]
      return {
        ...state,
        order_items: new_order_items,
        total_amount: (state.total_amount ?? 0) + action.payload.product_option.price * action.payload.quantity,
        status: ORDER_STATUS.PENDING,
      }
    case ORDER_ACTION_TYPES.CANCEL_ORDER:
      return {
        ...state,
        status: ORDER_STATUS.CANCELLED
      }
    case ORDER_ACTION_TYPES.UPDATE_ORDER_STATUS:
      return {
        ...state,
        status: action.payload || state.status
      }
    case ORDER_ACTION_TYPES.UPDATE_ORDER:
      return {
        ...state,
        order_items: action.payload.order_items || state.order_items,
        total_amount: action.payload.total_amount || state.total_amount,
        info: action.payload.info || state.info,
      }
    case ORDER_ACTION_TYPES.REMOVE_ORDER:
      return initialState;
    case ORDER_ACTION_TYPES.CONVERT_FROM_CART:
      return {
        ...state,
        order_items: action.payload.cart.cart_items,
        total_amount: action.payload.cart.cart_items.reduce((acc, item) => acc + item.product_option.price * item.quantity, 0),
        status: ORDER_STATUS.PENDING,
        createdAt: action.payload.cart.createdAt,
        is_cart: true,
      }
    case ORDER_ACTION_TYPES.REMOVE_ORDER_ITEM:
      return {
        ...state,
        order_items: state.order_items.filter(item => item.id !== action.payload.id),
        total_amount: state.total_amount - action.payload.product_option.price * action.payload.quantity,
      }
    case ORDER_ACTION_TYPES.FINISH_ORDER:
      return {
        ...state,
        status: ORDER_STATUS.PENDING
      }
    case ORDER_ACTION_TYPES.UPDATE_ORDER_INFO:
      return {
        ...state,
        info: action.payload.info
      }
    default:
      return state
  }
}

export default orderReducer;