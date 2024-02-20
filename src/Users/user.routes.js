import { Router } from 'express';
import { check } from 'express-validator';
import {
    userPost
} from './user.controller.js';

import {
    existMail,
    isValidRole,
    existsUser

} from '../helpers/db-validators.js';
import { validarCampos } from '../middlewares/validar-campos.js';

const router = Router();

router.post(
    "/",
    [
        check('name', 'name is required').not().isEmpty(),
        check("password", "The password must be less than 6 characters").isLength({ min: 6 }),
        check("mail", "This is not a valid email").isEmail(),
        check("mail").custom(existMail),
        check("role").custom(isValidRole),
        validarCampos
        
    ],
    userPost
)

export default router;