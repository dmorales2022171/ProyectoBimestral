import { Router } from "express";
import { check } from "express-validator";
import { invoiceGet, invoicePost, invoicePut } from '../bills/invoice.controller.js';
import { validateFilds } from "../middlewares/validar-campos.js";
import {validateJWT} from '../middlewares/validate-jwt.js'
import { isAdminRole } from '../middlewares/validate.role.js'

const router = Router();

router.post(
    '/',
    [
        validateJWT,
        validateFilds
    ],
    invoicePost
)

router.get(
    '/',
    [
        validateJWT,
    ],
    invoiceGet
)

router.put(
    '/:id',
    [
        validateJWT,
        isAdminRole,
    ],
    invoicePut
)

export default router ;