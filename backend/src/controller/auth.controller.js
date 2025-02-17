import User from "../models/user.model.js";
import bcrypt from 'bcryptjs'
import generateTokenAndSetCookies from "../utils/generateTokens.js";

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

         if(newUser){

            //Generate JWT Token Here 
            generateTokenAndSetCookies(newUser._id, res)

            await newUser.save();

            res.status(201).json({
                _id : newUser._id,
                fullname : newUser.fullname,
                username : newUser.username,
                profilePic : newUser.profilePic
            });
         }else {
            res.status(400).json({error : "Invalid User Data"})
         }
    } catch (error) {
        console.log("Error in signUp controller", error.message);
        res.status(500).json({error : "Internal Server Error"});
    }
}
export const loginUser = async (req, res) => {
    try {
        const {username, password} = req.body;
        const user = await User.findOne({username});

        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

        if(!user || !isPasswordCorrect) {
            return res.status(400).json({error : "Invalid Username or Password"});
        }
        generateTokenAndSetCookies(user._id, res);

            res.status(200).json({
                _id : user._id,
                fullname: user.fullname,
                username : user.username,
                profilePic : user.profilePic
            });
    } catch (error) {
        console.log("Error in Login controller", error.message);
        res.status(500).json({error : "Internal Server Error"});
    }
}
export const logoutUser = async(req, res) => {
    try {
        res.cookie("jwt", "", {maxAge : 0})
        res.status(200).json({message : "Logged Out Successfully"});
    } catch (error) {
         
        console.log("Error in Logout controller", error.message);
        res.status(500).json({error : "Internal Server Error"});
    }
}