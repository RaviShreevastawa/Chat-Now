import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protectRoute = async (req, res, next) => {
	try {
		// Ensure the cookie is available
		const token = req.cookies?.jwt;
		if (!token) {
			return res.status(401).json({ error: "Unauthorized - No Token Provided" });
		}

		// Verify JWT token
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		if (!decoded || !decoded.userId) {
			return res.status(401).json({ error: "Unauthorized - Invalid Token" });
		}

		// Find user in DB
		const user = await User.findById(decoded.userId).select("-password");
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		// Attach user to request object
		req.user = user;

		next();
	} catch (error) {
		console.error("Error in protectRoute middleware:", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export default protectRoute;
