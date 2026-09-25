import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getMyOrder, orderDetails } from "../controllers/order.controller.js";

const router = Router();

router.route("/my-orders").get(verifyJWT, getMyOrder)
router.route("/:id").get(verifyJWT, orderDetails )

export default router