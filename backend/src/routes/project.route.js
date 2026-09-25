import { Router } from "express";
import { productAdd, productBestSeller, productDelete, productEdit, productGet, productGetId, productNewArrivals, productSimilarGetId } from "../controllers/product.controller.js";
import { verifyJWT, verifyAdmin } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";



const router = Router()

router.route("/product").post(verifyJWT,verifyAdmin, productAdd)
router.route("/product/:id").put(verifyJWT, verifyAdmin,
    upload.fields([
    {
        name: "images",
        maxCount: 5
    }
]), productEdit)
router.route("/product/:id").delete(verifyJWT, verifyAdmin, productDelete)
router.route("/product/get").get(productGet)
router.route("/product/get/:id").get(productGetId)
router.route("/product/get/similar/:id").get(productSimilarGetId)
router.route("/product/best-seller").get( productBestSeller)
router.route("/product/new-arrivals").get(productNewArrivals)

export default router