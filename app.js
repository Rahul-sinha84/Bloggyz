var express                 = require("express"),
    mongoose                = require("mongoose"),
    bodyParser              = require("body-parser"),
    methodOverride          = require("method-override"),
    passport                = require("passport"),
    flash                   = require("connect-flash"),
    LocalStrategy           = require("passport-local"),
    passportLocalMongoose   = require("passport-local-mongoose");

var blogRoutes      = require("./routes/blogs"),
    commentRoutes   = require("./routes/comments"),
    userRoute       = require("./routes/users"),
    user            = require("./models/users");

mongoose.set('useUnifiedTopology',true);
// mongoose.connect("mongodb://localhost/my_blogs_2",{useNewUrlParser:true});
mongoose.connect("mongodb+srv://rahulsinha84:rahulsinha84@bloggyz-mu2lx.mongodb.net/Bloggyz?retryWrites=true&w=majority",{useNewUrlParser:true});

var app = express();

app.use(require("express-session")({
    secret:"I am Thor",
    resave:false,
    saveUninitialized: false
}));
//for setting up of passport
app.use(passport.initialize());
app.use(passport.session());
//for login
passport.use(new LocalStrategy(user.authenticate()));
//for encoding and coding the data
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());
app.use(flash());
app.use(function(req,res,next){
    res.locals.currentUser  = req.user;
    res.locals.moment       = require("moment");
    res.locals.error        = req.flash("error");
    res.locals.success      = req.flash("success");
    res.locals.warning      = req.flash("warning");
    res.locals.primary      = req.flash("primary");
    next();
});

app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine','ejs');


app.use("/blogs",blogRoutes);
app.use("/blogs/:id/comments",commentRoutes);
app.use("/",userRoute);

app.get("/",function(req,res){
    res.render("home");
});

app.get("*",function(req,res){
    res.render("error");
});

app.listen(process.env.PORT || 1600,function(){
    console.log("Server started on port 1600...");
});