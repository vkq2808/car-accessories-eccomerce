import bcrypt from 'bcryptjs';
import db from '../models/index';

const salt = process.env.SALT;
export const createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPasswordFromBcrypt = await hashUserPassword(data.password);
            await db.user.create({
                email: data.email,
                hashed_password: hashPasswordFromBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                phone: data.phone,
                birth: data.birth,
                role: data.role
            });
            resolve('Create a new user successful');
        } catch (e) {
            reject(e);

        }
    });
}

const hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e);
        }
    });
}

export const getAllUsers = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = db.user.findAll();
            resolve(users);
        } catch (e) {
            reject(e);
        }
    });
}

export const getUserInfoById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.user.findOne({
                where: { id: userId },
            });
            if (user) {
                resolve(user);
            } else {
                resolve({});
            }
        } catch (e) {
            reject(e);
        }
    });
}

export const updateUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.user.findOne({
                where: { id: data.id },
            });
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                await user.save();
                let allusers = await db.user.findAll();
                resolve(allusers);
            } else {
                resolve();
            }
        } catch (e) {
            reject(e);
        }
    });
}

export const deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.user.findOne({
                where: { id: userId },
            });
            if (user) {
                await user.destroy();
            }
            resolve();
        } catch (e) {
            reject(e);
        }
    });
}

export const getUserInfoByEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.user.findOne({
                where: { email: userEmail },
            });
            if (user) {
                resolve(user);
            } else {
                resolve();
            }
        } catch (e) {
            reject(e);
        }
    });
}

export const updateUserPassword = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.user.findOne({
                where: { email: data.email },
            });
            if (user) {
                user.hashed_password = await hashUserPassword(data.password);
                await user.save();
                resolve(user);
            } else {
                resolve();
            }
        } catch (e) {
            reject(e);
        }
    });
}