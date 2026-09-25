import dotenv from "dotenv"
import connectDB from "./db/database.js"
import { app } from "./app.js"

dotenv.config({
    path: "./.env" 
})




connectDB().then(
    async () =>{
    app.listen(process.env.PORT || 8000, () =>{
      console.log(`server is running on port: ${process.env.PORT}`)
    });
   
  }
).catch((error) => {
  console.log(" error connecting database",error)
})
