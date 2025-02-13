import express from 'express';
import dotenv from 'dotenv';
import authRoute from "./src/routes/auth.routes.js"
import {connectDB} from './src/db/connectDB.js';

const app = express();
const PORT = process.env.PORT || 3000;

dotenv.config();

app.use(express.json()); // to parse the incoming requests with JSON payloads (from req.body)

app.use("/api/auth", authRoute)

app.listen(PORT, () => {
    connectDB();
    console.log(`Server Running at port : ${PORT}`);
})