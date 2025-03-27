import JobSeeker from "../models/jobSeeker.model.js";
import crypto from "crypto"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import {v2 as cloudinary} from "cloudinary"
import Recruiter from "../models/recruiter.model.js"
dotenv.config()

//register Jobseeker
const registerJobSeeker=async(req,res)=>{
try {
    const {name,email,password,phone}=req.body;
if(!name && !email && !password && !phone){
   return res.status(400).json({
        message:"Please fill all fields"
    })
}

const existUser=await JobSeeker.findOne({email});
if(existUser){
    return res.status(400).json({
        message:"User exist"
    })
}
const verificationToken=crypto.randomBytes(32).toString('hex');
const user=await JobSeeker.create({
    name,
    email,
    password,
    phone,
    verificationToken:verificationToken
})

const refreshtoken=await jwt.sign({id:user._id,email:user.email,name:user.name},process.env.SECRET_KEY,{
    expiresIn:'1d'
})


res.cookie('refreshToken',refreshtoken,{
    httpOnly:true,
    secure:true,
    maxAge:24*60*60*1000
})

res.status(200).json({
    message:"Registered Succesfully",
    user
})
} catch (error) {
    res.status(400).json({
        message:"Error in registeration. Try again..",
        error
    })
}
}
//Login jobSeeker
const loginJobSeeker=async(req,res)=>{
    try {
        const {email,password}=req.body;
    if(!email && !password){
       return res.status(400).json({
            message:"Please fill all fields"
        })
    }
    
    const existUser=await JobSeeker.findOne({email});
    if(!existUser){
        return res.status(400).json({
            message:"Register first"
        })
    }

    const result=await bcrypt.compare(password,existUser.password)
    if(!result){
        return res.status(400).json({
            message:"Incorrrect email or password"
        })
    
    }
    
const refreshtoken=await jwt.sign({id:existUser._id,email:existUser.email,name:existUser.name},process.env.SECRET_KEY,{
    expiresIn:'1d'
})


res.cookie('refreshToken',refreshtoken,{
    httpOnly:true,
    secure:true,
    maxAge:24*60*60*1000
})

     res.status(200).json({
        message:"Logged in",
        existUser
    })

}catch(err){
    return res.status(400).json({
        message:"Error in login",
        err
    })
}
}

// Update Job Seeker Profile
const updateJobSeeker = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, phone, skills, experience, password } = req.body;
  
      let user = await JobSeeker.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      if (name) user.name = name;
      if (email) user.email = email;
      if (phone) user.phone = phone;
      if (skills) user.skills = skills;
      if (experience) user.experience = experience;
  
      if (password) {
        user.password = await bcrypt.hash(password, 10);
      }
  
      if (req.files) {
        if (req.files.profile_photo && req.files.profile_photo.length > 0) {
          const uploadedProfilePhoto = await cloudinary.uploader.upload(
            req.files.profile_photo[0].path
          );
          user.profile_photo = uploadedProfilePhoto.secure_url;
        }
  
        if (req.files.resume && req.files.resume.length > 0) {
          const uploadedResume = await cloudinary.uploader.upload(
            req.files.resume[0].path
          );
          user.resume = uploadedResume.secure_url;
        }
      }
  
      await user.save();
  
      res.status(200).json({ message: "Profile updated successfully", user });
    } catch (error) {
      res.status(500).json({ message: "Error updating profile", error });
    }
  };

  const registerRecruiter = async (req, res) => {
    try {
        const { name, email, password, phone, companyName, address } = req.body;

        if (!name || !email || !password || !companyName) {
            return res.status(400).json({ message: "Please fill all required fields" });
        }

        const existUser = await Recruiter.findOne({ email });
        if (existUser) {
            return res.status(400).json({ message: "Recruiter already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const recruiter = await Recruiter.create({
            name,
            email,
            password: hashedPassword,
            phone,
            companyName,
            address,
        });

        
        const token = jwt.sign(
            { id: recruiter._id, email: recruiter.email ,name:recruiter.name},
            process.env.SECRET_KEY ,
            { expiresIn: "1d" }
        );

        res.cookie('refreshToken',token,{
            httpOnly:true,
            secure:true,
            maxAge:24*60*60*1000
        })
        


        res.status(201).json({ message: "Recruiter registered successfully", recruiter });
    } catch (error) {
        res.status(500).json({ message: "Error registering recruiter", error: error.message });
    }
};

const loginRecruiter = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Please fill all fields" });
        }

        const recruiter = await Recruiter.findOne({ email });
        if (!recruiter) {
            return res.status(400).json({ message: "Recruiter not found, register first" });
        }

        const isMatch = await bcrypt.compare(password, recruiter.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect email or password" });
        }

        const token = jwt.sign(
            { id: recruiter._id, email: recruiter.email ,name:recruiter.name},
            process.env.SECRET_KEY ,
            { expiresIn: "1d" }
        );

        res.cookie('refreshToken',token,{
            httpOnly:true,
            secure:true,
            maxAge:24*60*60*1000
        })
        

        res.status(200).json({ message: "Logged in successfully", token, recruiter });
    } catch (error) {
        res.status(500).json({ message: "Error in login", error: error.message });
    }
};

const updateRecruiter = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, companyName, address, website, password } = req.body;

        let recruiter = await Recruiter.findById(id);
        if (!recruiter) {
            return res.status(404).json({ message: "Recruiter not found" });
        }

        if (name) recruiter.name = name;
        if (email) recruiter.email = email;
        if (phone) recruiter.phone = phone;
        if (companyName) recruiter.companyName = companyName;
        if (address) recruiter.address = address;
        if (website) recruiter.website = website;

        if (password) {
            recruiter.password = await bcrypt.hash(password, 10);
        }

        await recruiter.save();

        res.status(200).json({ message: "Profile updated successfully", recruiter });
    } catch (error) {
        res.status(500).json({ message: "Error updating profile", error: error.message });
    }
};

const validateUser=async(req,res)=>{

}

export  { registerJobSeeker, updateJobSeeker ,loginJobSeeker,updateRecruiter ,loginRecruiter,registerRecruiter}