import express from 'express';
import { visitorDetails, staffDetails , appointmentDetails} from '../controllers/view.js';
import { isAuthenticated } from '../middlewares/auth.js';

const router = express.Router();

router.get("/visitorDetails" ,isAuthenticated,visitorDetails);

router.get("/staffDetails" ,isAuthenticated, staffDetails);

router.get("/appointmentDetails",isAuthenticated,appointmentDetails);

export default router;