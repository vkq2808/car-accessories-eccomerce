import { combineReducers } from "redux";
import alert from './alertReducer'
import auth from './authReducer'
import product from './productReducer'
import cart from './cartReducer'
import category from './categoryReducer'
import theme from "./themeReducer";
import order from "./orderReducer";

export default combineReducers({
    alert,
    auth,
    product,
    cart,
    category,
    theme,
    order
})

