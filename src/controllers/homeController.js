import db from '../models/index';
import userService from '../services/userService';


let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll();

        console.log('...........................');
        console.log(data);
        console.log('...........................');
        return res.render('homepage.ejs', {
            data: JSON.stringify(data),
        });
    }
    catch (error) {
        console.log(error);
    }
}
// hàm getAbout
let getAboutPage = (req, res) => {
    return res.render('test/about.ejs');
}

let getCRUD = (req, res) => {
    return res.render('test/crud.ejs');
}

let getFindAllCRUD = async (req, res) => {
    let data = await userService.getAllUser();
    console.log('...........................');
    console.log(data);
    console.log('...........................');
    return res.render('homepage.ejs', {
        data: JSON.stringify(data),
    });
}

let postCRUD = async (req, res) => {
    let message = await userService.createUser(req.body);
    console.log(message);
    return res.send('postCRUD');
}

let getEditCRUD = async (req, res) => {
    let userId = req.query.id;
    if (userId) {
        let userData = await userService.getUserInfoById(userId);
        return res.render('users/editUser.ejs', {
            user: userData
        });
    }
    else {
        return res.send('không lấy được id');
    }
}

let putCRUD = async (req, res) => {
    let data = req.body;
    let allUsers = await userService.updateUserData(data);
    return res.render('users/findAllUser.ejs', {
        data: JSON.stringify(allUsers),
    });
}

let deleteCRUD = async (req, res) => {
    let userId = req.query.id;
    if (userId) {
        await userService.deleteUserById(userId);
        return res.send('delete thanh cong');
    }
    else {
        return res.send('không lấy được id');
    }
}

module.exports = {
    getHomePage: getHomePage,
    getAboutPage: getAboutPage,
    getCRUD: getCRUD,
    getFindAllCRUD: getFindAllCRUD,
    postCRUD: postCRUD,
    getEditCRUD: getEditCRUD,
    putCRUD: putCRUD,
    deleteCRUD: deleteCRUD
}
