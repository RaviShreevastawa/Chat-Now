import mongoose, {Schema} from "mongoose";

const messageModel = new Schema({
    sendId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    recievedId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    message : {
        type : String,
        required : true
    }
}, {timestamps : true});

const Message = mongoose.model("Message", messageModel)

export default Message;