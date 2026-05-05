import bcrypt from 'bcryptjs'; 
import db from '../models/index'; 


const salt = bcrypt.genSaltSync(10); 

let createNewUser = async (data) => { 
    return new Promise(async (resolve, reject) => { 
        try {
            let hashPasswordFromBcrypt = await hashUserPassword(data.password);
            await db.User.create({
                email: data.email,
                password: hashPasswordFromBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phoneNumber: data.phoneNumber,
                gender: data.gender === '1' ? true : false,
                roleId: data.roleId
            });
            resolve('OK create a new user successfull');
            
        } catch (e) {
            reject(e);
        }
    });
};

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => { 
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e);
        }
    });
};


let getAllUser = () => {
    return new Promise(async (resolve, reject) => { 
        try {
            let users = db.User.findAll({
                raw: true, 
            });
            resolve(users); 
        } catch (e) {
            reject(e);
        }
    });
};

// lay findOne CRUD
let getUserInfoById = (userId) => {
    return new Promise(async (resolve, reject) => { // dung Promise dam bao luon tra ket qua, trong xu ly bat dong bo
        try {
            let user = await db.User.findOne({
                where: {id: userId}, // query dieu kien cho tham so
                raw: true
            });
            if(user){
                resolve(user); // ham tra ve ket qua
            }else{
                resolve([]); // ham tra ve ket qua rong
            }
        } catch (e) {
            reject(e);
        }
    });
};

// ham put CRUD
let updateUser = (data) => {
    return new Promise(async (resolve, reject) => { // dung Promise dam bao luon tra ket qua, trong xu ly bat dong bo
        try {
            let user = await db.User.findOne({
                where: { id: data.id } // query dieu kien cho tham so
            });
            if(user){
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                await user.save();
                // lay danh sach user
                let allusers = await db.User.findAll();
                resolve(allusers);
            }else{
                resolve(); // ham tra ve ket qua rong
            }
        } catch (e) {
            reject(e);
        }
    });
};

// ham xoa user
let deleteUserById = (userId) => {
    return new Promise(async (resolve, reject) => { // dung Promise dam bao luon tra ket qua, trong xu ly bat dong bo
        try {
            let user = await db.User.findOne({
                where: { id : userId }
            });
            if(user){
                await user.destroy();
            }
            resolve(); // la return
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = { // xuat ham ra ben ngoai
    createNewUser: createNewUser,
    getAllUser: getAllUser,
    getUserInfoById: getUserInfoById,
    updateUser: updateUser,
    deleteUserById: deleteUserById
};
