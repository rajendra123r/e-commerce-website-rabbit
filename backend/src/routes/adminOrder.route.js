import { Router } from "express";
import { verifyAdmin, verifyJWT } from "../middlewares/auth.middleware.js";
import { deleteOrder, getOrders, updateOrderStatus } from "../controllers/adminOrder.controller.js";

const router = Router();

router.route("/").get(verifyJWT, verifyAdmin, getOrders)
router.route("/:id").put(verifyJWT, verifyAdmin, updateOrderStatus)
router.route("/delete/:id").delete(verifyJWT, verifyAdmin, deleteOrder)

export default router