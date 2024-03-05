'use strict'

import Category from '../categories/category.model.js';
import User from '../users/user.model.js'
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

export const categoryDelete = async (req, res ) => {
    const {id} = req.params;
    const category = await Category.findByIdAndUpdate(id, {status: false});
    const userAuthenticated = req.user;

    res.status(200).json({
        msg: "the category has been deleted",
        category,
        userAuthenticated
    })

}