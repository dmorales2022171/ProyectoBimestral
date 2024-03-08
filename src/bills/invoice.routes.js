import { Router } from "express";
import { check } from "express-validator";
import { invoicePost } from '../bills/invoice.controller.js';
import { validateFilds } from "../middlewares/validar-campos.js";
import {validateJWT} from '../middlewares/validate-jwt.js'

const router = Router();

router.post(
    '/',
    [
        validateJWT,
        validateFilds
    ],
    invoicePost
)

export default router ;