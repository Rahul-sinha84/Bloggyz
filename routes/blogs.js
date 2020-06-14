var express = require("express"),
    route   = express.Router({mergeParams:true}),
    blogs   = require("../models/blogs"),
    comments= require("../models/comments"),
    middleware = require("../middleware/index");

//  index route
route.get("/",function(req,res){
    function escapeRegex(text){
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&");
    };
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search),'gi');
        blogs.find({title:regex},function(err,blogs){
            if(err){
                console.log(err);
                res.redirect("back");
            }else{
                if(blogs.length != 0){
                    res.render("blogs/index",{blogs:blogs});
                }else{
                    req.flash("error","Could not find it!");
                    res.redirect("back");
                }    
            }
        });
    }else{    

        blogs.find({},function(err,blogs){
            if(err){
                console.log(err);
                res.redirect("back");
            }else{
                res.render("blogs/index",{blogs:blogs});
            }
        });
    } 
});
//new route
route.get("/new",middleware.isLoggedIn,function(req,res){
    res.render("blogs/new");
});
//create route
route.post("/",middleware.isLoggedIn,function(req,res){
    blogs.create(req.body.blogs,function(err,newBlog){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            newBlog.user._id = req.user._id;
            newBlog.user.username = req.user.username;
            newBlog.save();
            req.flash("success","Congratulations for your new blog " + req.user.username);
            res.redirect("/blogs");
        }
    });
});
// show route
route.get("/:id",function(req,res){
    blogs.findById(req.params.id).populate("comments").exec(function(err,blogs){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            res.render("blogs/show",{blogs:blogs});
        }
    });
});
//  edit route
route.get("/:id/edit",middleware.blogOwnership,function(req,res){
    blogs.findById(req.params.id,function(err,blogs){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            res.render("blogs/edit",{blogs:blogs});
        }
    });
});
// update route
route.put("/:id",middleware.blogOwnership,function(req,res){
    blogs.findByIdAndUpdate(req.params.id,req.body.blogs,function(err,blog){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            req.flash("warning","You Edited your Blog!");
            res.redirect("/blogs/"+blog._id);
        }
    });
});
// delete route
route.delete("/:id",middleware.blogOwnership,function(req,res){
    blogs.findByIdAndRemove(req.params.id,function(err,deletedBlog){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            req.flash("warning","Your Blog has been deleted!");
            res.redirect("/blogs");
        }
    });
});
//search bar
route.get("/search",function(req,res){
    
});

module.exports = route;