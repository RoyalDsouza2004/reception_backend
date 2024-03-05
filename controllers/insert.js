import { connection } from "../data/database.js"
import ErrorHandler from "../middlewares/error.js";

const dateTime = new Date();

export const addVisitor = async (req , res , next) => {
      const {name , email , phone , purpose , staffId } = req.body;


      try {
            await connection.query("INSERT INTO Visitor(Name , Email , Phone_Number , Purpose_of_Visit , Date_Time_of_Visit , Staff_Member_Met) values( ? , ? , ? , ? , ? , ? );", [name , email , phone , purpose , dateTime , staffId]) , (err , result) => {
                  if (err) return next(new ErrorHandler("Couldn't insert the values for the visitor" , 400));
            }

            return res.status(200).json({
                  success: true,
                  message : "Visitor Added Successfully",
            });
            
      } catch (error) {
            next(error);
      }
}

export const addNewStaff = async (req , res , next) => {
      const {id , name , email , phone , role , department} = req.body;

      try {
            await connection.query("INSERT INTO Staff values(?,?,?,?,?,?);", [id, name, email, phone, role, department ]), (err, result) => {
                  if (err) return next(new ErrorHandler("Couldn't insert the values for the staff", 400));
            }
            
            return res.status(200).json({
                  success: true,
                  message : "Staff Added Successfully",
            });

      } catch (error) {
            next(error);
      }
};

export const appointment = async (req , res , next) => {

      const {visitorId, staffId, purpose} = req.body;

      try {

            await connection.query("INSERT INTO appointment(Visitor_ID , Staff_Member_ID , Date_Time) values(?,?,?);", [visitorId, staffId, dateTime]), (err, result) => {
                  if (err) return next(new ErrorHandler("visitor or staff does not exists", 400));
            }
            res.status(200).json({
                  success: true,
                  message : "Appointment Added Successfully",
            });

            
      } catch (error) {
            next(error);
      }

};