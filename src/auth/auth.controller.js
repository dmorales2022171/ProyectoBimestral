import bcryptjs from 'bcryptjs';
import User from '../users/user.model.js';
import { generateJWT } from '../helpers/generate-jwt.js'


export const login = async (req, res) => {
    const { mail, password} = req.body;

    try{
        const user = await User.findOne({mail});

        if(!user){
            return res.status(400).json({
                msg: "Incorrect credentials, Email does not exist in the database"
            })
        }

        if (!user.status){
            return res.status(400).json({
                msg: "The user does not exist in the database"
            });
        }

        const validPassword = bcryptjs.compareSync(password, user.password);

        if(!validPassword){
            return res.status(400).json({
                msg: "the password is incorrect"
            })
        }

        const token = await generateJWT(user.id);

        res.status(200).json({
            msg: "Welcome",
            userName: user.userName,
            mail: user.mail,
            role: user.role,
            token
        })

    }catch(e){
        console.log(e);
        res.status(500).json({
            msg: "Contact administrator"
        })
    }
}
