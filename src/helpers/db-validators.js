import Role from '../roles/role.model.js';
import User from '../users/user.model.js';
import Category from '../categories/category.model.js'
import Product from '../products/product.model.js'

export const isValidRole = async (role = '') => {
    const existsRol = await Role.findOne({ role });
    if (!existsRol) {
        throw new Error(`the rol ${role} does not exist in the database`)
    }
}

export const existsMail = async (mail = '') => {
    const existsMail = await User.findOne({ mail });
    if (existsMail) {
        throw new Error(`the mail ${mail} has already been registered`)
    }
}

export const existProduct = async (productName = '') => {
    const existsProduct = await Product.findOne({ productName });
    if (existsProduct) {
        throw new Error(`the product ${productName} has already been registered`);
    }
}

export const validateCategoryExisting = async (name) => {
    const category = await Category.findOne({name: name});
    if(!category){
        throw new Error(`The category "${name}" does not exist in the database.`)
    }
}


export const existsUserById = async (id = '') => {
    const existsUser = await User.findById(id);
    if (!existsUser) {
        throw new Error(`The user with id:${id}, doesn't exist in the database`);
    }
}
export const existCategoryById = async (id = '') => {
    const category = await Category.findById(id);
    if (!category) {
        throw new Error(`The category with id: ${id} does not exist in the database`);
    }
}

export const existProductById = async (id = '') => {
    const product = await Product.findById(id);
    if(!product){
        throw new Error(`The product with id: ${id} does not exist in the database`)
    }
}


export const existCategory = async (name = '') => {
    const existCategory = await Category.findOne({ name });
    if (existCategory) {
        throw new Error(`the caegory ${name} has already been registered`)
    }
}