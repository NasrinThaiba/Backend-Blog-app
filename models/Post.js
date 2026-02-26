const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    content : {
        type : String,
        required : true
    },
    published : {
        type : Boolean,
        default : false
    },
    author : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },
      
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
}, {timestamps : true})

module.exports = mongoose.model("Post", postSchema)
