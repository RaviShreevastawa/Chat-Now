import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateTokens.js";
import cloudinary from "../config/cloudinaryConfig.js"; 
import fs from "fs";

export const registerUser = async (req, res) => {
	try {
		const { fullname, username, password, confirmPassword, gender } = req.body;

		if (!fullname || !username || !password || !confirmPassword || !gender) {
			return res.status(400).json({ error : "All fields are required" });
		}

		if (password !== confirmPassword) {
			return res.status(400).json({ error : "Passwords don't match" });
		}

		const existingUser = await User.findOne({ username });

		if (existingUser) {
			return res.status(400).json({ error: "Username already exists" });
		}

		// Hash the password before saving
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
		const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

		const newUser = new User({
			fullname,
			username,
			password: hashedPassword,
			gender,
			profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
		});

		await newUser.save();

		// Generate JWT and set cookie
		generateTokenAndSetCookie(newUser._id, res);

		res.status(201).json({
			_id: newUser._id,
			fullname: newUser.fullname,
			username: newUser.username,
			profilePic: newUser.profilePic,
		});
	} catch (error) {
		console.error("Error in signup controller:", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const loginUser = async (req, res) => {
	try {
		const { username, password } = req.body;

		if (!username || !password) {
			return res.status(400).json({ error: "All fields are required" });
		}

		const user = await User.findOne({ username });

		if (!user) {
			return res.status(400).json({ error: "Invalid username or password" });
		}

		const isPasswordCorrect = await bcrypt.compare(password, user.password);

		if (!isPasswordCorrect) {
			return res.status(400).json({ error: "Invalid username or password" });
		}

		// Generate JWT and set cookie
		generateTokenAndSetCookie(user._id, res);

		res.status(200).json({
			_id: user._id,
			fullname: user.fullname,
			username: user.username,
			profilePic: user.profilePic,
		});
	} catch (error) {
		console.error("Error in login controller:", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const logoutUser = async (req, res) => {
	try {
		const userId = req.user?._id;

		if (userId) {
			await User.findByIdAndUpdate(userId, { lastSeen: new Date() });
		}

		// Clear JWT cookie
		res.cookie("jwt", "", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 0,
		});

		res.status(200).json({ message: "Logged out successfully" });
	} catch (error) {
		console.error("Error in logout controller:", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};


export const uploadProfilePic = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const result = await cloudinary.uploader.upload(file.path, {
      folder: "chat-app/profile-pics",
      width: 300,
      crop: "scale",
    });

    // Delete temp file after upload
    fs.unlinkSync(file.path);

    // Update user's profilePic in DB (assumes req.user._id is available from middleware)
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profilePic: result.secure_url },
      { new: true }
    ).select("-password");

    res.status(200).json({ profilePic: user.profilePic });
  } catch (err) {
    console.error("Upload failed:", err);
    res.status(500).json({ error: "Upload failed" });
  }
};


export const getLastSeen = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("lastSeen");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ lastSeen: user.lastSeen });
  } catch (err) {
    res.status(500).json({ error: "Could not fetch last seen" });
  }
};
