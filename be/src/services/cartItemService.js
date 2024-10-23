import db from '../models/index.js';
export const createProductCartItem = async (cartId, productId, quantity) => {
    return new Promise(async (resolve, reject) => {
        try {
            const newCartItem = await db.cart_item.create({
                cartId: cartId,
                productId: productId,
                quantity: quantity
            });
            resolve(newCartItem);
        } catch (error) {
            console.log(error);
            reject(null);
        }
    });
}

export const updateCartItemQuantity = async (newCartItem) => {
    return new Promise(async (resolve, reject) => {
        try {
            const [effectedRows] = await db.cart_item.update({ quantity: newCartItem.quantity }, {
                where: {
                    id: newCartItem.id
                }
            });
            if (effectedRows > 0) {
                resolve(newCartItem);
            } else {
                resolve(null);
            }
        } catch (error) {
            console.log(error);
            reject(null);
        }
    });
}

export const findCartItemByProductId = async (cartId, productId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const cartItem = await db.cart_item.findOne({
                where: {
                    cartId: cartId,
                    productId: productId
                }
            });
            resolve(cartItem);
        } catch (error) {
            console.log(error);
            reject(null);
        }
    });
}

export const deleteCartItem = async (cartItemId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const effectedRows = await db.cart_item.destroy({
                where: {
                    id: cartItemId
                }
            });
            resolve(effectedRows);
        } catch (error) {
            console.log(error);
            reject(null);
        }
    });
}