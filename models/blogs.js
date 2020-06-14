var mongoose = require("mongoose");
var comments = require("../models/comments");


var blogSchema = new mongoose.Schema({
    title:String,
    image:String,
    about:String,
    user:{
        _id:{
            type:mongoose.Schema.Types.ObjectId ,
            ref:"User"
        },
        username:String,
    },
    comments:[
        {
            type: mongoose.Schema.Types.ObjectId ,
            ref : "Comment"
        }
    ],
    createdAt:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model("Blogs",blogSchema); 