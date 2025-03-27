//import packages
import express from "express"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import dbConnect from "./utils/db.connect.js";
import connectCloudinary from "./utils/cloudinary.js";

//import routes
import userRoutes from "./routes/user.routes.js"

dotenv.config();
connectCloudinary()

const app=express()
const port=process.env.PORT || 6000

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

dbConnect()

app.get('/',(req,res)=>{
    res.send('working')
})
app.use("/api/v1/user",userRoutes);

app.listen(port,()=>{
    console.log(`listening`)
})

