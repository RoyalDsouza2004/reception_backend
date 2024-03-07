import express from 'express';
import { register ,login, logout , profile } from '../controllers/admin.js';

const router = express.Router();

router.post("/register" ,register);

router.get("/profile", profile);

router.post("/login" , login);

router.get("/logout" ,logout);

export default router;