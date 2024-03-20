import { connection } from "../data/database.js";

export const updateApproval = async (req, res, next) => {
      const dateNow = new Date();
      try {
            const { approval } = req.body;
            let statusApproval ; 
            if(approval===true){
                  statusApproval = 'Approved';
            }else{
                  statusApproval = 'Cancelled';
            }

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
            COALESCE(Visitor_Count, 0) AS Visitor_Count
        FROM 
            (
                SELECT 1 AS Month UNION
                SELECT 2 AS Month UNION
                SELECT 3 AS Month UNION
                SELECT 4 AS Month UNION
                SELECT 5 AS Month UNION
                SELECT 6 AS Month UNION
                SELECT 7 AS Month
            ) AS all_months
        LEFT JOIN 
            (
                SELECT MONTH(Date_Time_of_Visit) AS Month, COUNT(*) AS Visitor_Count
                FROM Visitor
                WHERE YEAR(Date_Time_of_Visit) = YEAR(?)  
                  AND MONTH(Date_Time_of_Visit) BETWEEN 1 AND 7         
                GROUP BY Month
            ) AS visitor_counts
        ON 
            all_months.Month = visitor_counts.Month
        ORDER BY 
            all_months.Month;
        ` , [currentDate])

        const visitorCount = visitorData.map(row => row.Visitor_Count);

            res.status(200).json({
                  success: true,
                  visitorCount,
            })
      } catch (error) {
            next(error);
      }
}


export const deleteStaff = async(req , res , next) => {
      const {id} = req.params;

       try {
            await connection.query(`DELETE FROM Staff WHERE ID =? ;`, [id]);

            return res.status(200).json({
                  success: true,
                  message : "Staff Deleted Successfully",
            })
       }catch(err){
            next(err);
       }
}