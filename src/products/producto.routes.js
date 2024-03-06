import { Router } from "express";
import { check } from "express-validator";
import { productGet, productPost } from "../products/product.controller.js";
import { validateFilds } from "../middlewares/validar-campos.js";
import { validateJWT } from "../middlewares/validate-jwt.js";
import { isAdminRole, hasRoleAuthorized } from "../middlewares/validate.role.js";
import { existProduct, validateCategoryExisting } from "../helpers/db-validators.js";

const router = Router();

router.post(
    '/',
    [
    check('productName', 'the name product cannot be empty').not().isEmpty(),
    check('productName').custom(existProduct),
    check('description', 'the description cannot be empty').not().isEmpty(),
    check('price', 'the price cannot be empty').isNumeric().withMessage('The price must be a number'),
    check('stock', 'The stock of the product is required').not().isEmpty(),
    check('category', 'The category of the product is required').not().isEmpty(),
    validateFilds
    ],
    productPost
    
)

router.get(
    '/',
    validateJWT,
    productGet
)

export default router;
