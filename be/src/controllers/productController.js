import {
    getAllProducts,
    getProductDetailByPath,
    followProduct,
    getFollowingProducts,
    unfollowProduct,
    syncFollowProduct,
    getProductsByCategoryId
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

export const handleSyncFollowProduct = async (req, res) => {
    try {
        let user = req.user;
        let following_items = req.body.following_items;

        let user_following = await getFollowingProducts(user);

        console.log(following_items)
        following_items.forEach(item => {
            let isExist = false;
            user_following.forEach(following => {
                if (parseInt(item.product.id) === following.product.id) {
                    isExist = true;
                }
            });
            if (!isExist) {
                followProduct(user, item.product);
            }
        });

        console.log("Sync follow product successfully\n");
        return res.status(200).send({ msg: "Sync follow product successfully" });
    } catch (error) {
        console.log(error)
        return res.status(500).send({ msg: "Internal server error" });
    }
}

export const handleSearch = async (req, res) => {
    try {
        let categoryId = req.query.category_id;
        let page = req.query.page || 1;
        let limit = req.query.limit || 10;

        if (page < 1) page = 1;
        if (limit < 1 || limit > 100) limit = 20;

        if (categoryId) {
            let products = await getProductsByCategoryId(categoryId);

            if (!products) {
                console.log("Products not found");
                return res.status(204).send({ msg: "Products not found" });
            }

            const result = products.slice((page - 1) * limit, page * limit);

            console.log("Get products successfully\n");
            return res.status(200).send({ msg: "Get products successfully", products: result });
        } else {
            console.log("Category id is required");
            return res.status(400).send({ msg: "Category id is required" });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ msg: "Internal server error" });
    }
}