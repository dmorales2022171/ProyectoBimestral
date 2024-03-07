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

export const productGet = async (req = request, res = response) => {
    const { limit, from } = req.body;
    const query = { status: true };
    const { role: authUser } = req.user;

    if (authUser == "ADMIN_ROLE") {

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
    } else if (authUser == "CLIENT_ROLE") {
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

export const productPut = async (req, res = response) => {
    const { id } = req.params;
    const { category, ...rest } = req.body;

    const categories = await Category.findOne({ name: category });

    if (!categories) {
        return res.status(404).json({ msg: 'Category not found' });
    }

    await Product.findByIdAndUpdate(id, { ...rest, category: categories._id });

    const product = await Product.findOne({ _id: id }).populate('category', 'name');

    res.status(200).json({
        msg: "Product updated",
        product
    });
}

export const productDelete = async (req, res) => {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(id, { status: false });

    res.status(200).json({
        msg: "product delete correctly",
        product
    })
}

export const productGetByName = async (req, res) => {
    const { productName } = req.params;
    const { role: authUser } = req.user;

    if (authUser == "ADMIN_ROLE") {
        const product = await Product.findOne({ productName: productName }).populate('category', 'name');

        if (!product) {
            res.status(404).json({
                msg: "product not found"
            })
        }
        res.status(200).json({
            product
        })
    } else if (authUser == "CLIENT_ROLE") {
        const product = await Product.findOne({ productName: productName })
            .populate({
                path: 'category',
                select: 'name -_id' 
            })
            .select('-_id -__v'); 

        if (!product) {
            return res.status(404).json({
                msg: "Product not found"
            });
        }

        res.status(200).json({
            product
        });
    }
}

export const productsOutStock = async (req, res) => {
    const stock = await Product.find({ stock: 0 }).populate('category', 'name');

    res.status(200).json({
        stock
    })
}


export const mostSelledProducts = async (req, res = response) => {
    const { role: authUser } = req.user;

    if (authUser == "ADMIN_ROLE") {
        const mostSelledProducts = await Product.find()
            .sort({ sales: -1 })
            .populate('category', 'name');

        res.status(200).json({
            mostSelledProducts
        });
    } else if (authUser == "CLIENT_ROLE") {
        const mostSelledProducts = await Product.find()
            .sort({ sales: -1 })
            .populate({
                path: 'category',
                select: 'name -_id'
            })
            .select('-_id productName description price stock category');

        res.status(200).json({
            mostSelledProducts
        });
    }

};

export const productGetByCategory = async (req, res) => {
    const {category} = req.params;

    const categoria = await Category.findOne({ name: category });

    if (!categoria) {
        return res.status(404).json({ msg: 'Category not found' });
    }

    const productos = await Product.find({ category: categoria._id }).populate('category', 'name');

    if (productos.length === 0) {
        return res.status(404).json({ msg: 'No products found in this category' });
    }

    res.status(200).json({ productos });
}