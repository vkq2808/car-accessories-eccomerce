import { combineReducers } from "redux";
import alert from './alertReducer'
import auth from './authReducer'
import products from './productReducer'

export default combineReducers({
    alert,
    auth,
    products
})