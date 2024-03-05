import express from 'express';
import { isAuthenticated } from '../middlewares/auth.js';
import { updateApproval , totalCounts , visitorCounts } from '../controllers/data.js';

const router = express.Router();

router.patch("/approval/:id" , isAuthenticated , updateApproval);

router.get("/count" , isAuthenticated , totalCounts);

router.get("/visitor-count" , isAuthenticated , visitorCounts);

export default router;