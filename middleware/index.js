var blogs       = require("../models/blogs"),
    comments    = require("../models/comments");
var middleware = {};

middleware.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You needed to be logged in to do that!");
    res.redirect("/login");
}

middleware.blogOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        blogs.findById(req.params.id,function(err,blog){
            if(err){
                console.log(err);
                res.redirect("back");
            }else{
                if(blog.user._id.equals(req.user._id) || req.user.isAdmin){
                    return next();
                }
                req.flash("error","You are not the owner of this blog!");
                res.redirect("back");
            }
        });
    }else{
        req.flash("error","You needed to be logged in to do that!");
        res.redirect("back");
    }
}

middleware.commentOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        comments.findById(req.params.comment_id,function(err,comment){
            if(err){
                console.log(err);
                res.redirect("back");
            }else{
                if(comment.author._id.equals(req.user._id) || req.user.isAdmin){
                    return next();
                }
                req.flash("error","You are not the owner of this comment!");
                res.redirect("back");
            }
        })
    }else{
        req.flash("error","You needed to be logged in to do that!");
        res.redirect("back");
    }
}


module.exports = middleware;