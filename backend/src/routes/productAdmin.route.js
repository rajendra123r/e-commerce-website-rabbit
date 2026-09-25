import { Router } from "express";
import { verifyAdmin, verifyJWT } from "../middlewares/auth.middleware.js";
import { getProductAdmin } from "../controllers/productAdmin.controller.js";

const router = Router();

router.route("/").get(verifyJWT, verifyAdmin, getProductAdmin)

export default router;