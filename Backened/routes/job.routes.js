import express from 'express';
import authenticate from '../middleware/auth.middleware.js';
import { addJob,updateJob,deleteJob, getAllJobs } from '../controller/jobs.controller.js';
const router = express.Router();

router.get("/getjobs",authenticate,getAllJobs);
router.post('/addjob', authenticate, addJob);
router.put('/jobs/:id', authenticate, updateJob);
router.delete('/jobs/:id', authenticate, deleteJob);

export default router;