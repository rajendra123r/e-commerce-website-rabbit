

import connectDB from "./db/database.js"
import { app } from "./app.js"


connectDB().then(
    async () =>{
    app.listen(process.env.PORT || 8000, () =>{
      console.log(`server is running on port: ${process.env.PORT}`)
    });
   
  }
).catch((error) => {
  console.log(" error connecting database",error)
})
