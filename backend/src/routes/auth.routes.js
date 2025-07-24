import { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser
} from "../controller/auth.controller.js";
import protectRoute from "../middleware/protectRoute.js";
import { uploadProfilePic } from "../controller/auth.controller.js";
import { getLastSeen } from "../controller/auth.controller.js";

import multer from "multer";
import path from "path";

// Multer setup for file upload
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    },
});

const upload = multer({ storage });

const router =  Router();

router.post("/register", registerUser)

router.post("/login", loginUser)

router.post("/logout", protectRoute, logoutUser);

router.get("/last-seen/:userId",protectRoute, getLastSeen);

router.post("/upload-profile", protectRoute, upload.single("profilePic"), uploadProfilePic);

export default router;