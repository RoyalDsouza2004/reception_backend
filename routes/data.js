import express from 'express';
import { isAuthenticated } from '../middlewares/auth.js';
import { updateApproval , totalCounts , visitorCounts } from '../controllers/data.js';

const router = express.Router();

router.patch("/approval/:id" , updateApproval);

router.get("/count" , totalCounts);

router.get("/visitor-count" ,  visitorCounts);

export default router;