import { Router } from "express";
import { toSubscriber } from "../controllers/subscriber.controller.js";

const router = Router();

router.route("/").post(toSubscriber)

export default router