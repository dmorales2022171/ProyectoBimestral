'use strict'

import Category from '../categories/category.model.js';
import Product from '../products/product.model.js'
import { request, response } from 'express';

export const categoryPost = async (req, res) => {
    const { name, description } = req.body;
    const category = new Category({ name, description });

    await category.save();

    res.status(200).json({
        msg: "category has been created successfully ",
        category
    })
}
export const categoryGet = async (req = request, res = response) => {
    const { limit, from } = req.body;
    const query = { status: true };
    const { role: authUser } = req.user;

    if (authUser == "ADMIN_ROLE") {
        const [total, categories] = await Promise.all([
            Category.countDocuments(query),
            Category.find(query)
                .skip(Number(from))
                .limit(Number(limit))
        ]);

        res.status(200).json({
            total,
            categories
        })
    } else if (authUser == "CLIENT_ROLE") {
        const [total, categories] = await Promise.all([
            Category.countDocuments(query),
            Category.find(query, { _id: 0 })
                .skip(Number(from))
                .limit(Number(limit))
        ])

        res.status(200).json({
            total,
            categories
        })
    }

}

export const categoryPut = async (req, res) => {
    const { id } = req.params;
    const { _id, ...rest } = req.body;

    await Category.findByIdAndUpdate(id, rest);
    const category = await Category.findOne({ _id: id });

    res.status(200).json({
        msg: "category was updated successfully",
        category
    })

}

export const categoryDelete = async (req, res) => {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
        return res.status(404).json({ msg: 'Category not found' });
    }

    let defaultCategory = await Category.findOne({ name: 'Default' });

    if (!defaultCategory) {
        defaultCategory = new Category({ name: 'Default', description: 'Default category' });
        await defaultCategory.save();
    }

    const products = await Product.updateMany({ category: id }, { category: defaultCategory._id });

    await Category.findByIdAndDelete(id);

    res.status(200).json({
        msg: "The category has been deleted",
        category,
        products
    });
};
