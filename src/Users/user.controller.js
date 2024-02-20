import {response , requerest} from  'express';
import bcryptjs from  'bcryptjs';
import User from './user.model.js';

export const userPost = async (req, res)=>{
    const {name, mail, password, role} = req.body;
    const user = new User ({name, mail, password, role});

    const salt = bcryptjs.genSaltSync();
    user.password= await bcryptjs.hash(password,salt);

    await user.save();

    res.status(200).json({
        user
    });
}