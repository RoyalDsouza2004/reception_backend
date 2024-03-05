import express from 'express';
import { config } from 'dotenv';
import cookieParser from 'cookie-parser';
import adminRouter from "./routes/admin.js";
import viewRouter from "./routes/view.js";
import insertRouter from "./routes/insert.js";
import dataRouter from "./routes/data.js";

config({
      path: './data/config.env'
});

export const app = express();


app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/admin' , adminRouter);
app.use('/api/v1/insert', insertRouter);
app.use('/api/v2/view', viewRouter);
app.use('/api/v2/data', dataRouter);


app.get('/', (req, res) => {
      res.send("working");
});



