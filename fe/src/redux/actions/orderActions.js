import { deleteDataAPI, getDataAPI } from "../../utils/fetchData";

export const ORDER_ACTION_TYPES = {
  CREATE_ORDER: 'CREATE_ORDER',
  GET_ORDER: 'GET_ORDER',
  ADD_ORDER_ITEM: 'ADD_ORDER_ITEM',
  CANCEL_ORDER: 'CANCEL_ORDER',
  UPDATE_ORDER_STATUS: 'UPDATE_ORDER_STATUS',
  UPDATE_ORDER: 'UPDATE_ORDER',
  UPDATE_ORDER_ITEM_QUANTITY: 'UPDATE_ORDER_ITEM_QUANTITY',
  REMOVE_ORDER: 'REMOVE_ORDER',
  CONVERT_FROM_CART: 'CONVERT_FROM_CART',
  REMOVE_ORDER_ITEM: 'REMOVE_ORDER_ITEM',
  FINISH_ORDER: 'FINISH_ORDER',
  UPDATE_ORDER_INFO: 'UPDATE_ORDER_INFO',
};


export const getAllOrder = (token) => async (dispatch) => {
  try {
    const res = await getDataAPI('order', token)
    if (res.status === 200) {
      dispatch({
        type: ORDER_ACTION_TYPES.GET_ORDER,
        payload: res.data
      })
    }
  } catch (err) {
    console.log(err)
  }
}

export const getEmptyOrderAPI = (token) => async (dispatch) => {
  try {
    const res = await getDataAPI('order/empty', token)
    if (res.status === 200) {
      dispatch({
        type: ORDER_ACTION_TYPES.CREATE_ORDER,
        payload: res.data
      })
    }
  } catch (err) {
    console.log(err)
  }
}

export const getEmptyOrder = (token) => async (dispatch) => {
  try {
    if (token) {
      dispatch(getEmptyOrderAPI(token))
    } else {
      dispatch({
        type: ORDER_ACTION_TYPES.CREATE_ORDER,
        payload: {
          order_items: [],
          total_amount: 0,
        }
      })
    }
  } catch (err) {
    console.log(err)
  }
}

export const getOrderAPI = (token, order_id) => async (dispatch) => {
  try {
    const res = await getDataAPI(`order/${order_id}`, token)
    if (res.status === 200) {
      dispatch({
        type: ORDER_ACTION_TYPES.GET_ORDER,
        payload: res.data
      })
    }
  } catch (err) {
    console.log(err)
  }
}

export const finishInformation = ({ is_cart, cart_id }) => async (dispatch) => {
  if (cart_id) {
    try {
      await deleteDataAPI(`cart/${cart_id}`)
    } catch (err) {
      console.log(err)
    }
  }

  dispatch({
    type: ORDER_ACTION_TYPES.FINISH_ORDER,
    payload: { is_cart }
  })
}
