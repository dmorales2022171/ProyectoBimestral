import { Router } from "express";
import { check } from "express-validator";
import { categoryPost } from "./category.controller.js";
import { validateFilds } from "../middlewares/validar-campos.js";

const router = Router();

router.post(
    "/",
    [
        check("name", "the name cannot be empty").not().isEmpty(),
        check("description", "the description canno be empty").not().isEmpty(),
        validateFilds
    ],
    categoryPost
)

export default router;
