import db from '../models';

export const getAllCategories = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const categories = await db.category.findAll({
                include: [
                    {
                        model: db.product,
                        as: 'products',
                        attributes: ['id', 'name', 'price', 'imageUrl'],
                    },
                ],
            });
            resolve(categories);
        } catch (err) {
            reject(err);
        }
    });
}