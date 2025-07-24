import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from "cors";
import cookieParser from 'cookie-parser';

import authRoute from "./src/routes/auth.routes.js";
import userRoute from "./src/routes/user.routes.js";
import messageRoute from './src/routes/message.routes.js';

import { connectDB } from './src/db/connectDB.js';
import { app, server } from "./src/socket/socket.js";

dotenv.config({ path: './.env' });

const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

// ✅ Middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  credentials: true,
  methods: "GET, POST, PUT, DELETE, PATCH",
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(cookieParser());


// ✅ App routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/message", messageRoute);

// ✅ Static files
app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

// ✅ Start Server
server.listen(PORT, () => {
  connectDB();
  console.log(`🚀 Server Running at http://localhost:${PORT}`);
});
