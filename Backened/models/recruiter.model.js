import mongoose from "mongoose"
const RecruiterSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    companyName: { type: String, required: true },
    address: { type: String },
    website: { type: String },
    jobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }]
}, { timestamps: true });

export default  mongoose.model('Recruiter', RecruiterSchema);
