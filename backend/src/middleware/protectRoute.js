import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protectRoute = async (req, res, next) => {
	try {
		const token = req.cookies?.jwt;
		if (!token) {
			return res.status(401).json({ error: "Unauthorized - No Token Provided" });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		if (!decoded || !decoded.userId) {
			return res.status(401).json({ error: "Unauthorized - Invalid Token" });
		}

		// Update lastSeen timestamp
		await User.findByIdAndUpdate(decoded.userId, { lastSeen: new Date() });

		// Fetch the updated user (excluding password)
		const user = await User.findById(decoded.userId).select("-password");
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		req.user = user;
		next();
	} catch (error) {
		console.error("Error in protectRoute middleware:", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export default protectRoute;
