var express = require("express"),
    route   = express.Router({mergeParams:true});
    blogs   = require("../models/blogs"),
    comments= require("../models/comments"),
    middleware = require("../middleware/index");


//  new route
route.get("/new",middleware.isLoggedIn,function(req,res){
    blogs.findById(req.params.id,function(err,blogs){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            res.render("comments/new.ejs",{blogs:blogs});
        }
    });
});
//  create route
route.post("/",middleware.isLoggedIn,function(req,res){
    comments.create({
        text:req.body.text
    },function(err,comment){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            blogs.findById(req.params.id,function(err,blog){
                if(err){
                    console.log(err);
                    res.redirect("back");
                }else{
                    comment.author._id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    blog.comments.push(comment);
                    blog.save();
                    req.flash("success","You Commented!");
                    res.redirect("/blogs/"+req.params.id);
                }
            });
        }
    });
});
//  edit route
route.get("/:comment_id/edit",middleware.commentOwnership,function(req,res){
    blogs.findById(req.params.id,function(err,blogs){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            comments.findById(req.params.comment_id,function(err,comment){
                if(err){
                    console.log(err);
                    res.redirect("back");
                }else{
                    res.render("comments/edit",{blogs:blogs,comment:comment});
                }
            });
        }
    });
});
//  update route
route.put("/:comment_id",middleware.commentOwnership,function(req,res){
    comments.findByIdAndUpdate(req.params.comment_id,req.body.comments,function(err,comment){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            req.flash("warning","You edited your Comment!");
            res.redirect("/blogs/"+req.params.id);
        }
    });
});

//  delete route
route.delete("/:comment_id/delete",middleware.commentOwnership,function(req,res){
    comments.findByIdAndRemove(req.params.comment_id,function(err,deletedBlog){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            req.flash("warning","Your Comment has been deleted!");
            res.redirect("/blogs/"+req.params.id);
        }
    });
});

module.exports = route;