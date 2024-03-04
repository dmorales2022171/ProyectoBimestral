import { Router } from "express";
import { check } from "express-validator";
import { login } from "./auth.controller.js";
import { validateFilds } from "../middlewares/validar-campos.js";

const router = Router();

router.post(
    "/login",
    [
        check("mail", "This is not a valid email").isEmail(),
        check("password", "the password is required").not().isEmpty(),
        validateFilds
    ],
    login
)

export default router;