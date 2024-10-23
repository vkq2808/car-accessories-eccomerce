<<<<<<< HEAD
import { handleLogin, handleRegister, handleVerifyEmail, handleForgetPassword, handleResetPassword, handleRefreshToken }
    from './authController';
import { handleGetUserInfo }
    from './userController';
import { handleUnfollowProduct, handleGetProductDetail, handleGetAllProducts, handleFollowProduct, handleGetFollowingProducts }
    from './productController'
=======
import { handleLogin, handleRegister, handleVerifyEmail, handleForgetPassword, handleResetPassword, handleRefreshToken } from './authController';
import { handleGetUserInfo } from './userController';
import { handleGetProductDetail, handleGetAllProducts } from './productController'
>>>>>>> 0883aba932a12d174e483cb7df379f0094262ded

export {
    handleLogin,
    handleRegister,
    handleVerifyEmail,
    handleForgetPassword,
    handleResetPassword,
    handleRefreshToken,
    handleGetUserInfo,
    handleGetProductDetail,
<<<<<<< HEAD
    handleGetAllProducts,
    handleFollowProduct,
    handleGetFollowingProducts,
    handleUnfollowProduct
=======
    handleGetAllProducts
>>>>>>> 0883aba932a12d174e483cb7df379f0094262ded
}