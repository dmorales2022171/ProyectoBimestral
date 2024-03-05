'use strict'
import bcryptjs from 'bcryptjs';
import User from './user.model.js';
import { request, response } from 'express';

export const userPost = async (req, res) => {
    const { name, mail, password, role } = req.body;
    const user = new User({ name, mail, password, role });

    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);

    await user.save();

    res.status(200).json({
        msg: "the user has been created",
        user
    })
}

export const userGet = async (req = request, res = response) => {
    const { limit, from } = req.body;
    const query = { status: true }

    const [total, users] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
            .skip(Number(from))
            .limit(Number(limit))
    ]);

    res.status(200).json({
        total,
        users
    })
}

export const userPut = async (req, res) => {
    const { id } = req.params;
    const { _id, password, ...rest } = req.body;

    if (password) {
        const salt = bcryptjs.genSaltSync();
        rest.password = bcryptjs.hashSync(password, salt);
    }

    await User.findByIdAndUpdate(id, rest);

    const user = await User.findOne({ _id: id });

    res.status(200).json({
        msg: "User updated!",
        user
    })
}

export const userDelete = async (req, res) => {
    const { id: userId } = req.params;
    const { id: authUserId } = req.user;

    if (userId !== authUserId) {
        return res.status(403).json({
            msg: "You do not have permission to change the status of this account"
        });
    }
    const User = await User.findByIdAndUpdate(userId, { status: false });

    res.status(200).json({
        msg: "User status updated successfully",
        user: updatedUser
    });

};
