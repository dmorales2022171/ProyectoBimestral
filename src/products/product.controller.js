import Product from '../products/product.model.js'
import Category from '../categories/category.model.js'
import { request, response } from 'express';
import User from '../users/user.model.js'

export const productPost = async (req, res) => {
    const data = req.body;

    try {
        const category = await Category.findOne({ name: data.category });

        if (!category) {
            return res.status(404).send({
                message: 'Category does not exist'
            });
        }

        const product = await Product.findOne({ productName: data.productName });

        if (product) {
            return res.status(400).json({
                message: 'Product already exists'
            });
        }

        const newProduct = new Product({
            ...data,
            category: category._id,
            description: category.description
        });

        await newProduct.save();

        return res.status(200).json({
            product: newProduct,
            category: {
                name: category.name,
                description: category.description
            }
        });
    } catch (error) {
        console.error('Error creating product:', error);
        return res.status(500).json({ message: 'Error creating product' });
    }
};

export const productGet = async(req = request, res = response) => {
    const {limit, from} = req.body;
    const query = {status: true};
    const { role: authUser } = req.user;

    if(authUser == "ADMIN_ROLE"){

    const [total, products] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
        .populate('category', 'name')
        .skip(Number(from))
        .limit(Number(limit))
    ]);

    res.status(200).json({
        total,
        products
    })

}else if (authUser == "CLIENT_ROLE"){
    const [total, products] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query, { _id: 0 })
            .populate('category', '-_id name') 
            .skip(Number(from))
            .limit(Number(limit))
    ]);

    res.status(200).json({
        total,
        products
    });
}
}