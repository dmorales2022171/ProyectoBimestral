import Role from '../roles/role.model.js';
import User from '../Users/user.model.js';

export const isValidRole = async (role = '') => {
    const existsRol = await Role.findOne({ role });
    if (!existsRol) {
        throw new Error(`the rol ${role} does not exist in the database`)
    }
}

export const existsMail = async (mail = '') => {
    const existMail = await User.findOne({ mail });
    if (existMail) {
        throw new Error(`the mail ${mail} has already been registered`)
    }
}

export const existsUserById = async (id = '') => {
    const existsUser  = await User.findById(id);
    if(!existsUser){
        throw new Error(`The user with id:${id}, doesn't exist in the database`);
    }
}