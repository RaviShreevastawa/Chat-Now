import express from 'express';
import dotenv from 'dotenv';
import path from 'path'
import cookieParser from 'cookie-parser';

import authRoute from "./src/routes/auth.routes.js"
import userRoute from "./src/routes/user.routes.js"
import messageRoute from './src/routes/message.routes.js';

import {connectDB} from './src/db/connectDB.js';
import {app, server} from "./src/socket/socket.js"

const PORT = process.env.PORT || 3000;

const __dirname = path.resolve();

dotenv.config();

app.use(express.json()); // to parse the incoming requests with JSON payloads (from req.body)
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/message", messageRoute);
app.use("/api/users", userRoute);

app.use(express.static(path.join(__dirname, "/frontend/dist")))

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"))
})

server.listen(PORT, () => {
    connectDB();
    console.log(`Server Running at port : ${PORT}`);
})