import mongoose from "mongoose";
const JobSchema = new mongoose.Schema({
    recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'Recruiter', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['remote', 'on-site', 'hybrid'], required: true },
    skills: [{ type: String }], // Required skills for the job
    location: { type: String },
    salary: { type: String },
    category: { type: String }, // IT, Finance, Marketing, etc.
    experience_required: { type: Number }, // Min years of experience
    job_status: { type: String, enum: ['open', 'closed', 'filled'], default: 'open' },
    posted_on: { type: Date, default: Date.now }
}, { timestamps: true });

export default  mongoose.model('Job', JobSchema);
