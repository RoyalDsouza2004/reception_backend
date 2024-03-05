import express from 'express';
import { addNewStaff, addVisitor, appointment } from '../controllers/insert.js';
import { isAuthenticated } from '../middlewares/auth.js';

const router = express.Router();


router.post('/add-visitor' ,isAuthenticated ,addVisitor);

router.post('/add-new-staff' ,isAuthenticated, addNewStaff);

router.post("/new-appointment",isAuthenticated, appointment);


export default router;