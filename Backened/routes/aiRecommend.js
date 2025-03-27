import { CohereClient } from "cohere-ai";
import Job from "../models/job.model.js";
import dotenv from "dotenv";
import express from "express";
import authenticate from "../middleware/auth.middleware.js";

dotenv.config();
const router = express.Router();

const cohere = new CohereClient({
    token: process.env.COHERE_API_KEY
});

const getJobRecommendations = async (req, res) => {
    try {
        const { skills, experience } = req.body;

        if (!skills || !experience) {
            return res.status(400).json({ message: "Skills and experience are required" });
        }

        const jobs = await Job.find();
        const jobDescriptions = jobs.map(job => ({
            title: job.title,
            description: job.description,
            requiredSkills: job.skills.join(", "),
            experienceRequired: job.experience_required
        }));

        const prompt = `Suggest the best job matches for a candidate with skills: ${skills.join(", ")} 
        and ${experience} years of experience. Ensure that experience_required does not exceed ${experience} years. 
        Available jobs: ${JSON.stringify(jobDescriptions)}`;

        const response = await cohere.generate({
            model: "command",
            prompt,
            max_tokens: 300
        });

        const recommendedText = response.generations[0]?.text || "";
        
        const recommendedTitles = recommendedText.match(/\* (.+)/g)?.map(match => match.replace("* ", "")) || [];
        
        console.log("AI Recommended Titles:", recommendedTitles); 

        const recommendedJobs = await Job.find({
            title: { $regex: recommendedTitles.join("|"), $options: "i" },
            experience_required: { $lte: experience } 
        });

        res.status(200).json({ recommendedJobs });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

router.post('/aiRecommendedJobs',authenticate, getJobRecommendations);
export default router;
