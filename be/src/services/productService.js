
import db from '../models/index';

export const getProductDetailByPath = async (path) => {
    return new Promise(async (resolve, reject) => {
        try {
            let product = await db.product.findOne({
                where: { path: path },
                include: [db.category],
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

export const getAllProducts = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let products = await db.product.findAll({
                include: [{
                    model: db.category
                }],
                order: [
                    ['createdAt', 'DESC']
                ]
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

export const followProduct = async (user, product) => {
    return new Promise(async (resolve, reject) => {
        try {
            const userFollowProduct = await db.product_follow.create({
                userId: user.id,
                productId: product.id
            })
            resolve(userFollowProduct);
        } catch (e) {
            reject(e);
        }
    });
}

export const getFollowingProducts = async (user) => {
    return new Promise(async (resolve, reject) => {
        try {
            let followings = await db.product_follow.findAll({
                where: { userId: user.id },
                include: [{
                    model: db.product,
                    include: [db.category]
                }],
                order: [
                    ['createdAt', 'DESC']
                ]
            });
            if (followings) {
                resolve(followings);
            } else {
                resolve(null);
            }
        } catch (e) {
            reject(e);
        }
    });
}

export const unfollowProduct = async (user, productId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const userUnfollowProduct = await db.product_follow.destroy({
                where: {
                    userId: user.id,
                    productId: productId
                }
            })
            resolve(userUnfollowProduct);
        } catch (e) {
            reject(e);
        }
    });
}

export const getProductsByCategoryId = async (categoryId, page, limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let products = await db.product.findAll({
                where: categoryId !== -1 ? { categoryId: categoryId } : null,
                include: [db.category],
                order: [
                    ['createdAt', 'DESC']
                ],
                limit: limit,
                offset: (page - 1) * limit
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

export const searchAndCountProducts = async (search, categoryId, page, limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let results = await db.product.findAndCountAll({
                where: categoryId !== -1 ? {
                    categoryId: categoryId,
                    path: {
                        [db.Sequelize.Op.like]: `%${search}%`
                    }
                } : {
                    path: {
                        [db.Sequelize.Op.like]: `%${search}%`
                    }
                },
                include: [db.category],
                order: [
                    ['createdAt', 'DESC']
                ],
                limit: limit,
                offset: page ? (page - 1) * limit : null
            });
            if (results) {
                resolve(results);
            } else {
                resolve(null);
            }
        } catch (e) {
            reject(e);
        }
    });
}