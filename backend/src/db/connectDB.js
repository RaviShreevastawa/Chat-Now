import mongoose from "mongoose";
import dotenv from 'dotenv';

const connectDB = async() => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`)
        console.log(`MongoDB Connect Successfully DBHost : ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("MongoDB connection Failed !", error)
    }
}

export {connectDB}