import { Router } from "express";
import { verifyAdmin, verifyJWT } from "../middlewares/auth.middleware.js";
import { addUser, deleteUser, editUser, getAllUsers } from "../controllers/admin.controller.js";

const router = Router();

router.route("/users").get(verifyJWT, verifyAdmin, getAllUsers)
router.route("/add-user").post(verifyJWT, verifyAdmin, addUser)
router.route("/update-user/:id").put(verifyJWT, verifyAdmin, editUser)
router.route("/delete-user/:id").delete(verifyJWT, verifyAdmin, deleteUser)

export default router