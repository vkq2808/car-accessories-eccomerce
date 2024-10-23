
import db from '../models/index';

export const getProductDetailByPath = (path) => {
    return new Promise(async (resolve, reject) => {
        try {
            let product = await db.product.findOne({
                where: { path: path },
                include: [db.category]
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
            let products = await db.product.findAll({
                include: [{
                    model: db.category
                }],
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
