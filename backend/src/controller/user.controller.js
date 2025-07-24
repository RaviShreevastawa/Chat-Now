import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
	try {
		const loggedInUserId = req.user._id;

		const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } })
			.select("fullname profilePic lastSeen");

		res.status(200).json(filteredUsers); // ✅ Send directly as array, not inside an object
	} catch (error) {
		console.log("Error in getUsersForSidebar:", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};