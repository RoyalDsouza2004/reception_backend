import express from 'express';
import { register ,login, logout , profile } from '../controllers/admin.js';
import { isAuthenticated } from '../middlewares/auth.js';

const router = express.Router();

router.post("/register" ,register);

router.get("/profile",isAuthenticated, profile);

router.post("/login" , login);

router.get("/logout" ,logout);

export default router;