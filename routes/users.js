var express     = require("express"),
    route       = express.Router({mergeParams:true}),
    passport    = require("passport"),
    users       = require("../models/users"),
    middleware  = require("../middleware/index"),
    blogs       = require("../models/blogs"); 

//signup
route.get("/signup",function(req,res){
    res.render("users/signup");
});

route.post("/signup",function(req,res){
    var User = {
        username:req.body.username,
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        email:req.body.email,
        isAdmin:false
    }
    if(req.body.adminCode){
        console.log(req.body.adminCode === "secretCode123");
        if(req.body.adminCode === "secretCode123"){
            User.isAdmin = true;
            users.register(User,req.body.password,function(err,user){
                if(err){
                    console.log(err);
                    req.flash("error",err.message);
                    res.redirect("back");
                }else{
                    passport.authenticate("local")(req,res,function(){
                        req.flash("success","Welcome " + req.body.firstName + " !");
                        req.flash("primary","You are now an admin!");
                        res.redirect("/");
                    });
                }
            });
        }else{
            req.flash("error","The code you entered was wrong, ignore it if you don't wanted to be admin!");
            res.redirect("back");
        }
    }else
    users.register(User,req.body.password,function(err,user){
        if(err){
            console.log(err);
            req.flash("error",err.message);
            res.redirect("back");
        }else{
            passport.authenticate("local")(req,res,function(){
                req.flash("success","Welcome " + req.body.firstName + " !");
                res.redirect("/");
            });
        }
    });
});
//login
route.get("/login",function(req,res){
    res.render("users/login");
});

route.post("/login",passport.authenticate("local",{
    successRedirect:"/",
    failureRedirect:"/login"
}),function(req,res){});
//logout
route.get("/logout",function(req,res){
    req.logOut();
    req.flash("success","Successfully Logged you Out!");
    res.redirect("/");
});

//show (profile page)
route.get("/user/:user_id",function(req,res){
    users.findById(req.params.user_id,function(err,User){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            blogs.find().where("user._id").equals(User._id).exec(function(err,Blogs){
                if(err){
                    console.log(err);
                    res.redirect("back");
                }else{

                    res.render("users/show",{User:User,Blogs:Blogs});
                }
            });
        }
    });
});

module.exports = route;