import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        const filtereduser = await User.find({_id : {$ne : loggedInUserId}}).select("-password");

        res.status(200).json({filtereduser})
    } catch (error) {
        console.log("Error in getUserForSidebar : ", error.message);
        res.send(500).json({error : "Internal server error"});
    }
}