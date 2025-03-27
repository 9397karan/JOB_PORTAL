const ApplicationSchema = new mongoose.Schema({
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    seeker: { type: mongoose.Schema.Types.ObjectId, ref: 'JobSeeker', required: true },
    resume_url: { type: String }, 
    status: { 
        type: String, 
        enum: ['applied', 'reviewed', 'interview', 'hired', 'rejected'], 
        default: 'applied' 
    },
    applied_at: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Application', ApplicationSchema);
