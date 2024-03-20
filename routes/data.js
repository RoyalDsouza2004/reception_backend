import express from 'express';
import { isAuthenticated } from '../middlewares/auth.js';
import { updateApproval , totalCounts , visitorCounts, deleteStaff } from '../controllers/data.js';

const router = express.Router();

router.patch("/approval/:id" , updateApproval);

router.get("/count" , totalCounts);

router.get("/visitor-count" ,  visitorCounts);

router.delete("/delete-staff/:id" , deleteStaff);

export default router;