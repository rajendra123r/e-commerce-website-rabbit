import { Router } from "express"
import { cartAdd, deleteproductToCart, getCartProduct, mergeProduct, updateProductQuantity } from "../controllers/cart.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/").post(cartAdd)
router.route("/").put(updateProductQuantity)
router.route("/").delete(deleteproductToCart)
router.route("/").get(getCartProduct)
router.route("/merge").post( verifyJWT,mergeProduct)

export default router