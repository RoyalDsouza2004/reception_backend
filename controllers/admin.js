import { connection } from "../data/database.js";
import bcryptjs from "bcryptjs";
import ErrorHandler from "../middlewares/error.js"
import { sendCookie } from "../utils/features.js";

export const register = async(req , res , next) =>{

      const {id , name , email , password} = req.body;

      try{

            const hashedPassword = await bcryptjs.hash(password , 10);

            await connection.query("INSERT INTO Admin(id , Name , Email , password) values(? ,? ,? ,?)" , [id , name , email , hashedPassword] ), (err, result) =>{
                  if (err) return next(new ErrorHandler("Admin already exists" , 400));
            }

            return res.status(200).json({
                  success: true,
                  message: "Admin registered successfully"
            })

      }catch(err){
            next(err);
      }
      
}

export const login = async(req, res , next) =>{

      const {email , password} = req.body;

      try {
            
            const [user] = await connection.query("SELECT * FROM Admin WHERE email = ?" , [email]) ;

            if(user.length === 0) return next(new ErrorHandler("invalid email and password"));

            const isMatch = await bcryptjs.compare(password, user[0].password);

            if(!isMatch) return next(new ErrorHandler("invalid email and password"));

            sendCookie(user[0] , res , `Welcome back ${user[0].Name}` , 200);

      } catch (error) {
            next(error);
      }


}

export const profile = (req, res) => {
      res.status(200).json({
            success: true,
            user: req.user[0],
      })
}

export const logout = (req , res , next) =>{
      res.status(200).cookie("token" , "" , {
            expires: new Date(Date.now()),
            sameSite: process.env.NODE_ENV === "Developement" ? "lax" : "none",
		secure: process.env.NODE_ENV === "Developement" ? false : true,
      }).json({
            success: true,
            message: "logout successfully"
      })
}