import jwt from "jsonwebtoken";

export const sendCookie = (user, res, message, statusCode = 200) => {
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

      res.status(statusCode).cookie("token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
            // sameSite: process.env.NODE_ENV === "Developement" ? "lax" : "none",
            // secure: process.env.NODE_ENV === "Developement" ? false : true,
      }).json({
            sucess: true,
            message,
      });
}