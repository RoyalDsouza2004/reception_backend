CREATE TABLE Admin(
  id VARCHAR(20) PRIMARY KEY,
  Name VARCHAR(20),
  Email VARCHAR(20) ,
  password VARCHAR(200) NOT NULL
);

CREATE TABLE Staff (
  ID INT PRIMARY KEY,
  Name VARCHAR(20) NOT NULL,
  Email VARCHAR(20),
  Phone_Number BIGINT NOT NULL,
  Role VARCHAR(20),
  Department VARCHAR(20)
);

CREATE TABLE Visitor (
  ID INT PRIMARY KEY AUTO_INCREMENT,
  Name VARCHAR(20) NOT NULL,
  Email VARCHAR(20),
  Phone_Number BIGINT ,
  Purpose_of_Visit VARCHAR(30),
  Date_Time_of_Visit DATETIME ,
  Staff_Member_Met INT,
  FOREIGN KEY(Staff_Member_Met) REFERENCES Staff(ID) ON DELETE CASCADE
);

CREATE TABLE Appointment (
  ID INT PRIMARY KEY AUTO_INCREMENT,
  Date_Time DATETIME NOT NULL,
  Visitor_ID INT ,
  Staff_Member_ID INT NOT NULL,
  Purpose VARCHAR(20),
  Booking_Status ENUM('Pending', 'Approved', 'Cancelled') DEFAULT 'Pending',
  Approval_DateTime DATETIME DEFAULT=NULL,
  CONSTRAINT unique_appointment UNIQUE (Visitor_ID, Staff_Member_ID, Date_Time),
  FOREIGN KEY(Staff_Member_ID) REFERENCES Staff(ID) ON DELETE CASCADE,
  FOREIGN KEY(Visitor_ID) REFERENCES Visitor(ID) ON DELETE CASCADE
);


CREATE TABLE Package (
  Tracking_Number INT PRIMARY KEY,
  Sender_ID INT ,
  Recipient_ID INT ,
  Description VARCHAR(30),
  Delivery_Date_Time DATETIME,
  Status ENUM('Received', 'Delivered', 'Lost') DEFAULT 'Received',
  FOREIGN KEY(Sender_ID) REFERENCES Visitor(ID) ON DELETE CASCADE,
  FOREIGN KEY(Sender_ID) REFERENCES Staff(ID) ON DELETE CASCADE, 
  FOREIGN KEY(Recipient_ID) REFERENCES Visitor(ID) ON DELETE CASCADE,
  FOREIGN KEY(Recipient_ID) REFERENCES Staff(ID) ON DELETE CASCADE 
);


CREATE TABLE Message (
  ID INT PRIMARY KEY AUTO_INCREMENT,
  Sender_ID INT NOT NULL,
  Recipient_ID INT NOT NULL,
  Content TEXT,
  Date_Time_Received DATETIME NOT NULL,
  Delivery_Status ENUM('Sent', 'Delivered', 'Read') DEFAULT 'Sent',
  FOREIGN KEY(Sender_ID) REFERENCES Visitor(ID) ON DELETE CASCADE,
  FOREIGN KEY(Sender_ID) REFERENCES Staff(ID) ON DELETE CASCADE, 
  FOREIGN KEY(Recipient_ID) REFERENCES Visitor(ID) ON DELETE CASCADE,
  FOREIGN KEY(Recipient_ID) REFERENCES Staff(ID) ON DELETE CASCADE 
);


--visitor details

SELECT 
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
    Appointment A ON V.ID = A.Visitor_ID;



-- auto add the purpose when the appointment is created
DELIMITER //

CREATE TRIGGER before_appointment_insert
BEFORE INSERT ON Appointment
FOR EACH ROW
BEGIN
    SET NEW.Purpose = (SELECT Purpose_of_Visit FROM Visitor WHERE ID = NEW.Visitor_ID);
END;
//

DELIMITER ;


--appointment details

SELECT 
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


--staff details

SELECT * FROM Staff;


-- cancel appointment
UPDATE Appointment
SET Booking_Status = 'Cancelled',
    Approval_DateTime = NOW()
WHERE ID = <your_appointment_id>;

--approve appointment
UPDATE Appointment
SET Booking_Status = 'Approved',
    Approval_DateTime = NOW()
WHERE ID = <your_appointment_id>;


-- visitor count for month

SELECT 
    COUNT(*) AS Visitor_Count
FROM 
    Visitor
WHERE 
    YEAR(Date_Time_of_Visit) = 2024 AND 
    MONTH(Date_Time_of_Visit) = 2 
GROUP BY 
    Visit_Year, Visit_Month, Visit_Day;


-- total staff count

SELECT COUNT(*) AS Total_Staff_Count
FROM Staff;


-- total appointment pending , approved or cancelled

SELECT Booking_Status, COUNT(*) AS Total_Appointments
FROM Appointment
GROUP BY Booking_Status;


--last 3 queries equalent to this ,
SELECT
    (SELECT COUNT(*) FROM Visitor WHERE YEAR(Date_Time_of_Visit) = 2024 AND MONTH(Date_Time_of_Visit) = 2) AS Visitor_Count,
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


