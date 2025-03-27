import mongoose from "mongoose"
import bcrypt from "bcryptjs";
const JobSeekerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    profile_photo: { type: String
     }, 
    resume: { type: String },
    skills: [{ type: String }], 
    experience: { type: Number }, 
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    applications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Application' }]
}, { timestamps: true });

JobSeekerSchema.pre('save',async function(next){
    if(this.isModified('password')){
        this.password=await bcrypt.hash(this.password,10)
    }
    next()
})
export default  mongoose.model('JobSeeker', JobSeekerSchema);
