import { Router } from "express";
import { check } from "express-validator";
import { categoryDelete, categoryGet, categoryPost, categoryPut } from "./category.controller.js";
import { validateFilds } from "../middlewares/validar-campos.js";
import { validateJWT } from "../middlewares/validate-jwt.js";
import { existCategory, existCategoryById, existsUserById } from "../helpers/db-validators.js";
import { hasRoleAuthorized, isAdminRole } from "../middlewares/validate.role.js";


const router = Router();

router.post(
    "/",
    [
        check("name", "the name cannot be empty").not().isEmpty(),
        check("name").custom(existCategory),
        check("description", "the description canno be empty").not().isEmpty(),
        validateFilds
    ],
    categoryPost
)

router.get(
    "/",
    [
        validateJWT
    ],
    categoryGet
)

router.put(
    "/:id",
    [
        validateJWT,
        isAdminRole,
        check('id', 'it is not a valid id').isMongoId(),
        check('id').custom(existCategoryById),
        check("name", "the name cannot be empty").not().isEmpty(),
        check("description", "the description cannot be empty").not().isEmpty(),
        validateFilds
    ],
    categoryPut
);

router.delete(
    "/:id",
    [
        validateJWT,
        isAdminRole,
        check('id', 'it is not a valid id').isMongoId(),
        check('id').custom(existCategoryById),      
        validateFilds 
    ],
    categoryDelete
)

export default router;
