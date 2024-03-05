import { connection } from "../data/database.js";

export const updateApproval = async (req, res, next) => {
      const dateNow = new Date();
      try {
            const { approval } = req.body;
            const statusApproval = approval === true ? 'Approved' : 'Cancelled';

            const { id } = req.params;

            await connection.query(`UPDATE Appointment
            SET Booking_Status = ?,
                Approval_DateTime = ?
            WHERE ID = ? ;` , [statusApproval, dateNow, id]);

            res.status(200).json({
                  success: true,
                  message: `Appointment ${statusApproval}`
            });

      } catch (error) {
            next(error);
      }
}

export const totalCounts = async (req, res, next) => {

      const date = new Date();

      const month = date.getMonth() + 1;

      try {

            const [results] = await connection.query(`SELECT
            (SELECT COUNT(*) FROM Visitor WHERE YEAR(Date_Time_of_Visit) = 2024 AND MONTH(Date_Time_of_Visit) = ?) AS visitors_this_month,
            (SELECT COUNT(*) FROM Staff) AS Total_Staff_Count,
            JSON_OBJECTAGG(Booking_Status, Total_Appointments) AS Total_Appointments
            FROM 
            (
                  SELECT 
                  Booking_Status, 
                    COUNT(*) AS Total_Appointments 
                    FROM 
                    Appointment 
                    GROUP BY 
                    Booking_Status
                    ) AS subquery;
                    `, [month]);

            return res.status(200).json({
                  success: true,
                  results,
            })

      } catch (error) {
            next(error);
      }
}

export const visitorCounts = async (req, res, next) => {
      const currentDate = new Date();
      try {
            const [visitorData] = await connection.query(`SELECT 
            MONTH(Date_Time_of_Visit) AS Month,
            COUNT(*) AS Visitor_Count
            FROM 
                  Visitor
            WHERE 
                  YEAR(Date_Time_of_Visit) = YEAR(?)
            GROUP BY 
                  Month
            ORDER BY 
                  Month;` , [currentDate])

            res.status(200).json({
                  success: true,
                  visitorData,
            })
      } catch (error) {
            next(error);
      }
}