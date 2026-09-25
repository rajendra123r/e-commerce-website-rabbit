import { configureStore } from "@reduxjs/toolkit" ;
import authReducer from "./features/auth/authSlice"
import productReducer from "./features/products/productsSlice";
import cartReducer from "./features/cart/cartSlice"
import checkoutReducer from "./features/checkout/checkoutSlice"
import orderReducer from "./features/orders/orderSlice"
import adminReducer from "./features/admin/adminSlice"
import adminProductReducer from "./features/adminProduct/adminProductSlice"
import adminOrdersReducer from "./features/adminOrder/adminOrderSlice"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        products: productReducer,
        cart: cartReducer,
        checkout: checkoutReducer,
        orders: orderReducer,
        admin: adminReducer,
        adminProducts: adminProductReducer,
        adminOrders: adminOrdersReducer
    }
})