import db from '../models';

export const getAllCategories = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const categories = await db.category.findAll();
            resolve(categories);
        } catch (err) {
            reject(err);
        }
    });
}