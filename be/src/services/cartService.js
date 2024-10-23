import db from '../models/index.js';

export const getCartByUserId = async (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let cart = await db.cart.findOne({
                where: { userId: userId },
                include: [{
                    model: db.cart_item,
                    include: [db.product]  // Lấy thông tin product thông qua cart_item
                }]
            });
            if (cart) {
                resolve(cart);
            } else {
                resolve(null);
            }
        } catch (e) {
            reject(e);
        }
    });
}


export const createCart = async (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let cart = await db.cart.create({ userId: userId });
            if (cart) {
                resolve(cart);
            } else {
                resolve(null);
            }
        } catch (e) {
            reject(e);
        }
    });
}