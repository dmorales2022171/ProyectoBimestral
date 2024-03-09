import { Router } from 'express';
import { check } from 'express-validator';
import { userDelete, userGet, userPost, userPut } from './user.controller.js';

import { existsMail, existsUserById } from '../helpers/db-validators.js';
import { validateFilds } from '../middlewares/validar-campos.js';
import { validateJWT } from '../middlewares/validate-jwt.js';
import { hasRoleAuthorized } from '../middlewares/validate.role.js';

const router = Router();

router.post(
    "/",
    [
        check('name', 'name is required').not().isEmpty(),
        check("password", "The password must be less than 6 characters").isLength({ min: 6 }),
        check("mail", "This is not a valid email").isEmail(),
        check("mail").custom(existsMail),
        validateFilds
    ],
    userPost
)

router.get(
    "/",
    validateJWT,
    userGet
)

router.put(
    "/:id",
    [
        check("id", "it is not valid id").isMongoId(),
        check("id").custom(existsUserById),
    ],
    userPut
)

router.delete(
    "/:id",
    [
        validateJWT
    ],
    userDelete
)
export default router;