import { combineReducers } from "redux";
import alert from './alertReducer'
import auth from './authReducer'
<<<<<<<< HEAD:fe/src/redux/reducers/index.js
import product from './productReducer'
import cart from './cartReducer'
import category from './categoryReducer'
========
import products from './productReducer'
import cart from './cartReducer'
>>>>>>>> 0883aba932a12d174e483cb7df379f0094262ded:fe/src/redux/reducer/index.js

export default combineReducers({
    alert,
    auth,
<<<<<<<< HEAD:fe/src/redux/reducers/index.js
    product,
    cart,
    category
========
    products,
    cart
>>>>>>>> 0883aba932a12d174e483cb7df379f0094262ded:fe/src/redux/reducer/index.js
})