import Job from '../models/job.model.js';
import Recruiter from "../models/recruiter.model.js";

const addJob = async (req, res) => {
    try {
        const job = new Job({ recruiter: req.user.id, ...req.body });
        await job.save();

        await Recruiter.findByIdAndUpdate(req.user.id, { $push: { jobs: job._id } });
        
        res.status(201).json({ message: 'Job posted successfully', job });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateJob = async (req, res) => {
    try {
        const job = await Job.findOneAndUpdate({ _id: req.params.id, recruiter: req.user.id }, req.body, { new: true });
        if (!job) return res.status(404).json({ message: 'Job not found or unauthorized' });
        res.json({ message: 'Job updated successfully', job });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteJob = async (req, res) => {
    try {
        const job = await Job.findOneAndDelete({ _id: req.params.id, recruiter: req.user.id });
        if (!job) return res.status(404).json({ message: 'Job not found or unauthorized' });
        
        await Recruiter.findByIdAndUpdate(req.user.id, { $pull: { jobs: req.params.id } });
        
        res.json({ message: 'Job deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find().populate('recruiter', 'name companyName');
        res.status(200).json({ jobs });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export { addJob, updateJob, deleteJob, getAllJobs };
