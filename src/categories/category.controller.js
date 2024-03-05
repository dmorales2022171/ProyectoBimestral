'use strict'

import Category from '../categories/category.model.js';
import { request, response } from 'express';

export const categoryPost = async (req, res) => {
    const {name, description} = req.body;
    const category = new Category({name, description});

    await category.save();

    res.status(200).json({
        msg: "category has been created successfully ",
        category
    })
}

export const caegoryGet = async (req = request , res = response) => {
    const {limit, from} = req.body;
    const query = {status: true};

    const [total, categories] = await Promise.all([
        Category.countDoc
        ])
}