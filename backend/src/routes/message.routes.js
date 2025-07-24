import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { sendMessage, getMessages, editMessage } from "../controller/sendMessage.controller.js";
import { markMessagesAsSeen } from "../controller/sendMessage.controller.js";
import { deleteMessage } from "../controller/sendMessage.controller.js";

const router = express.Router();

router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);
router.put("/seen/:senderId", protectRoute, markMessagesAsSeen);
router.put("/edit/:messageId", protectRoute, editMessage);
router.delete("/delete/:messageId", protectRoute, deleteMessage);

export default router;