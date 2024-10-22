import { getAllProducts, getProductDetailByPath } from '../services/productService.js';

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