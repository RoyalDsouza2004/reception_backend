import jwt from "jsonwebtoken";
import ErrorHandler from "./error.js";
import { connection } from "../data/database.js";

export const isAuthenticated = async(req , res , next)=>{
	const {token} = req.cookies;

	if(!token) return next(new ErrorHandler("Login first" , 404));

      
	const decoded = jwt.verify(token , process.env.JWT_SECRET);

      [req.user] = await connection.query("SELECT * FROM Admin WHERE id = ?" , [decoded.id]) ;

	next();
}