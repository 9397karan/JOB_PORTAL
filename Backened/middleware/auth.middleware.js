import jwt from "jsonwebtoken"
import dotenv from 'dotenv'
dotenv.config()

async function authenticate(req,res,next) {
const token=req.cookies.refreshToken
if(!token){
    return res.status(400).json({
        message:"Token expired"
    })
}
const user=await jwt.verify(token,process.env.SECRET_KEY)

const accessToken=await jwt.sign({id:user.id,email:user.email,name:user.name},process.env.SECRET_KEY,{
    expiresIn:'5m'
})


res.cookie('accessToken',accessToken,{
    httpOnly:true,
    secure:true,
    maxAge:5*60*1000
})
req.user=user
    next()
}
export default authenticate