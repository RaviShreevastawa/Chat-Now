import User from "../models/user.model.js";
import bcrypt from 'bcryptjs'

export const registerUser = async(req, res) => {
    try {
        const {fullname, username, password, confirmPassword, gender} = req.body;

        if(password !== confirmPassword){
            return res.status(400).json({error : "Password don't match"});
        }

        const user = await User.findOne({username});

        if(user){
            return res.status(400).json({error : "Username already exist "})
        }

        // Hash Password Here

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        const boyProfilePic = `http://avatar.iran.liara.run/public/boy?username${username}`
        const girlProfilePic = `http://avatar.iran.liara.run/public/girl?username${username}`

        const  newUser = new User({
            fullname,
            username,
            password : hashedPassword,
            gender,
            profilePic : gender === "male" ? boyProfilePic : girlProfilePic
        })

        await newUser.save();

        res.status(201).json({
            _id : newUser._id,
            fullname : newUser.fullname,
            username : newUser.username,
            profilePic : newUser.profilePic
        })
    } catch (error) {
        console.log("Error in signUp controller", error.message);
        res.status(500).json({error : "Internal Server Error"});
    }
}
export const loginUser = (req, res) => {
    res.send("Login Route")
}
export const logoutUser = (req, res) => {
    res.send("Logout Route")
}