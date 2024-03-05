import { connection } from "../data/database.js"

export const visitorDetails = async (req, res, next) => {

      try {

            const [visitors] = await connection.query(`SELECT 
            V.ID AS Visitor_ID, 
            V.Name, 
            V.Phone_Number, 
            V.Purpose_of_Visit AS Purpose, 
            CASE 
                WHEN A.Booking_Status = 'Approved' or A.Booking_Status = 'Pending' THEN 'Yes'
                ELSE 'No'
            END AS Appointment_Present,
            CASE 
                WHEN A.Booking_Status = 'Approved' THEN TIMESTAMPDIFF(MINUTE, A.Date_Time, A.Approval_DateTime)
                WHEN A.Booking_Status = 'Pending' THEN 'waiting'
                ELSE 'No appointment'
            END AS Waiting_Time
        FROM 
            Visitor V
        LEFT JOIN 
            Appointment A ON V.ID = A.Visitor_ID;`);

            return res.status(200).json({
                  success: true,
                  visitors,
            });

      } catch (error) {
            next(error);
      }

}

export const staffDetails = async (req, res, next) => {
      try {
            const [staff] = await connection.query("SELECT * FROM Staff;");
            return res.status(200).json({
                  success: true,
                  staff,
            });

      } catch (error) {
            next(error);
      }
}

export const appointmentDetails = async (req, res, send) => {
      try {
            const [appointments] = await connection.query(`SELECT 
            A.ID AS Appointment_ID,
            V.Name AS Visitor_Name,
            V.Email AS Visitor_Email,
            A.Date_Time AS Appointment_Date_Time,
            A.Booking_Status AS Appointment_Status,
            IFNULL(A.Approval_DateTime, 'waiting for response') AS Approved_on 
            FROM 
                  Appointment A
            LEFT JOIN 
                  Visitor V ON A.Visitor_ID = V.ID;
            `);

            return res.status(200).json({
                  success: true,
                  appointments,
            });

      } catch (error) {
            next(error);
      }
}

