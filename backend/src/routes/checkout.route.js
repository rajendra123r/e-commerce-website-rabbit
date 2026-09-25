import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createCheckout, finalCheckout, updateCheckout } from "../controllers/checkout.controller.js";

const router = Router();

router.route("/").post(verifyJWT, createCheckout)
router.route("/:id/pay").put(updateCheckout)
router.route("/:id/finalize").post(verifyJWT, finalCheckout)

export default router