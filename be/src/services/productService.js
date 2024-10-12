
import db from '../models/index';

export const getProductDetailByPath = (path) => {
    return new Promise(async (resolve, reject) => {
        try {
            let product = await db.Product.findOne({
                where: { path: path },
                raw: true,
            });
            if (product) {
                resolve(product);
            } else {
                resolve(null);
            }
        } catch (e) {
            reject(e);
        }
    });
}

export const getAllProducts = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let products = await db.Product.findAll({
                raw: true,
            });
            if (products) {
                resolve(products);
            } else {
                resolve(null);
            }
        } catch (e) {
            reject(e);
        }
    });
}
