import { mongoose, Schema } from 'mongoose';
 


const userModel = new Schema({
    fullname : {
        type : String,
        required : true
    },
    username : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true,
        minlength : 6
    },
    gender : {
        type : String,
        required : true,
        enum : ["male", "female"]
    },
    profilePic : {
        type : String,
        default : ""
    },
    lastSeen: {
        type: Date,
        default: Date.now
    }
}, {timestamps : true})


const User = mongoose.model("User", userModel);

export default User