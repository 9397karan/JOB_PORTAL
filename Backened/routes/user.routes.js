import express from "express"
import {loginJobSeeker, loginRecruiter, registerJobSeeker, registerRecruiter, updateJobSeeker, updateRecruiter} from "../controller/user.controller.js"
import authenticate from "../middleware/auth.middleware.js"
import upload from "../middleware/multer.js"
const router= express.Router()

router.post('/registerJobSeeker',registerJobSeeker)
router.post('/loginJobSeeker',loginJobSeeker)
router.put('/updateJobSeeker/:id',authenticate,upload.fields([{ name: "profile_photo" }, { name: "resume" }]),updateJobSeeker)
router.put('/updateRecruiter/:id',authenticate,updateRecruiter)
router.post('/registerRecruiter',registerRecruiter);
router.post('/loginRecruiter',loginRecruiter)

export default router;