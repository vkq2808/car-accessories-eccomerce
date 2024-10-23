import { handleLogin, handleRegister, handleVerifyEmail, handleForgetPassword, handleResetPassword, handleRefreshToken }
    from './authController';
import { handleGetUserInfo }
    from './userController';
import { handleUnfollowProduct, handleGetProductDetail, handleGetAllProducts, handleFollowProduct, handleGetFollowingProducts }
    from './productController'

export {
    handleLogin,
    handleRegister,
    handleVerifyEmail,
    handleForgetPassword,
    handleResetPassword,
    handleRefreshToken,
    handleGetUserInfo,
    handleGetProductDetail,
    handleGetAllProducts,
    handleFollowProduct,
    handleGetFollowingProducts,
    handleUnfollowProduct
}