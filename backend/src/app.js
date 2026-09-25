import express from "express"
import cors from "cors"
import cookieParser  from "cookie-parser"


const app = express();


app.use(cors(
    {
        origin: "http://localhost:5173",
        credentials: true,
    }
))

//  app.get("/first",(req, res) => {
//     return res.send("this server is running  successfully")
  
//  })

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// import routting

import userRoutes from "./routes/user.route.js"
import productRoutes from "./routes/project.route.js"
import cartRoutes from "./routes/cart.route.js"
import checkoutRoutes from "./routes/checkout.route.js"
import orderRoutes from "./routes/order.route.js"
import subscriberRoutes from "./routes/subscriber.route.js"

// routes declaration
app.use("/api/users", userRoutes)
app.use("/api", productRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/checkout", checkoutRoutes)
app.use("/api/order", orderRoutes)
app.use("/api/subscriber", subscriberRoutes)

// admin routes
import adminRoutes from "./routes/admin.route.js"
import productAdminRoutes from "./routes/productAdmin.route.js"
import adminOrdersRoutes from "./routes/adminOrder.route.js"

app.use("/api/admin", adminRoutes)
app.use("/api/admin/product", productAdminRoutes)
app.use("/api/admin/orders", adminOrdersRoutes)








export { app }