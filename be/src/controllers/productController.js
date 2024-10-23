import {
    getAllProducts,
    getProductDetailByPath,
    followProduct,
    getFollowingProducts,
    unfollowProduct
}
    from '../services/productService.js';

export const handleGetProductDetail = async (req, res) => {
    try {
        let product = await getProductDetailByPath(req.params.path);

        if (!product) {
            console.log("Product not found");
            return res.status(206).send({ msg: "Không tìm thấy sản phẩm" });
        }
        console.log("Get product detail successfully\n");
        return res.status(200).send({ msg: "Get product detail successfully", product: product });
    } catch (error) {
        console.log(error)
        return res.status(500).send({ msg: "Internal server error" });
    }
}

export const handleGetAllProducts = async (req, res) => {
    try {
        let products = await getAllProducts();

        if (!products) {
            console.log("Products not found");
            return res.status(204).send({ msg: "Products not found" });
        }
        console.log("Get products successfully\n");
        return res.status(200).send({ msg: "Get products successfully", products: products });
    } catch (error) {
        console.log(error)
        return res.status(500).send({ msg: "Internal server error" });
    }
}

export const handleFollowProduct = async (req, res) => {
    try {
        let product = req.body.product;
        let user = req.user;

        const product_follow = await followProduct(user, product);

        if (!product_follow) {
            console.log("Follow product failed");
            return res.status(400).send({ msg: "Follow product failed" });
        }
        return res.status(200).send({ msg: "Follow product successfully" });
    } catch (error) {
        console.log(error)
        return res.status(500).send({ msg: "Internal server error" });
    }
}

export const handleGetFollowingProducts = async (req, res) => {
    try {
        let user = req.user;

        let followings = await getFollowingProducts(user);

        if (!followings) {
            console.log("Followings not found");
            return res.status(204).send({ msg: "Followings not found" });
        }

        console.log("Get followings successfully\n");
        return res.status(200).send({ msg: "Get followings successfully", products: followings });
    } catch (error) {
        console.log(error)
        return res.status(500).send({ msg: "Internal server error" });
    }
}

export const handleUnfollowProduct = async (req, res) => {
    try {
        let productId = parseInt(req.params.id);
        let user = req.user;
        let result = await unfollowProduct(user, productId);

        if (!result) {
            console.log("Unfollow product failed");
            return res.status(400).send({ msg: "Unfollow product failed" });
        }
        console.log("Unfollow product successfully\n");
        return res.status(200).send({ msg: "Unfollow product successfully" });
    } catch (error) {
        console.log(error)
        return res.status(500).send({ msg: "Internal server error" });
    }
}