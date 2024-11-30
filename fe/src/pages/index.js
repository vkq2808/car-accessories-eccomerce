import Regist from './auth/regist/Regist';
import Login from './auth/login/Login';
import Logout from './auth/login/Logout';
import Home from './home/Home';
import UserProfile from './home/UserProfile';
import VerifyEmail from './auth/regist/VerifyEmail';
import PasswordResetPage from './auth/resetPassword/PasswordResetPage';
import EnterNewPassword from './auth/resetPassword/EnterNewPassword';
import ProductDetail from './product/ProductDetail';
import SearchPage from './home/SearchPage';
import CartDetail from './shop/cart/CartDetail';
import OrderInfoConfirmationPage from './shop/checkout/InfoConfirmation';
import PaymentMethodSelector from './shop/checkout/PaymentMethodSelector';
import PaymentResultPage from './shop/checkout/PaymentResultPage';
import NotFound from './common/NotFound';
import ServerClosed from './common/ServerClosed';
export * from './admin';


export {
    Regist,
    Login,
    Logout,
    Home,
    UserProfile,
    VerifyEmail,
    PasswordResetPage,
    EnterNewPassword,
    ProductDetail,
    SearchPage,
    CartDetail,
    OrderInfoConfirmationPage,
    PaymentMethodSelector,
    PaymentResultPage,
    NotFound,
    ServerClosed
}