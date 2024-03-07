import { Router } from "express";
import { check } from "express-validator";
import { mostSelledProducts, productDelete, productGet, productGetByCategory, productGetByName, productPost, productPut, productsOutStock } from "../products/product.controller.js";
import { validateFilds } from "../middlewares/validar-campos.js";
import { validateJWT } from "../middlewares/validate-jwt.js";
import { isAdminRole, hasRoleAuthorized } from "../middlewares/validate.role.js";
import { existProduct, existProductById, validateCategoryExisting } from "../helpers/db-validators.js";

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

router.put(
    "/:id",
    [
        check('id', 'it is not a valid id').isMongoId(),
        check('id').custom(existProductById),  
        validateFilds
    ],
    productPut
)

router.delete(
    '/:id',
    [
        check('id').custom(existProductById),  
        validateFilds      
    ],
    productDelete
)

router.get(
    '/productByName/:productName',
    [
        validateJWT,
        validateFilds
    ],
    productGetByName
)

router.get(
    '/productsOutOfStock',
    [
        validateJWT,
        isAdminRole,
        validateFilds
    ],
    productsOutStock
)

router.get(
    '/mostSelledProducts',
    validateJWT,
    mostSelledProducts
)

router.get(
    '/productByCategory/:category',
    productGetByCategory
)

export default router;
