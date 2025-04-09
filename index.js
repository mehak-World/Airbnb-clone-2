const express =  require("express")
const app = express();
const PORT = 3000;
const path = require("path")
const ejsMate = require("ejs-mate")
const mongoose = require("mongoose")
const Listing = require("./models/Listing")
const Review = require("./models/Review")
const ExpressError = require("./errors/ExpressError")
const listingRouter = require("./routers/Listing")
const reviewRouter = require("./routers/Review")
const session = require("express-session")
const flash = require("connect-flash")
const User =  require("./models/User")
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy;
const userRouter = require("./routers/User")
require("dotenv").config()
const MongoStore = require("connect-mongo")




app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({extended: true}))

app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: true, 
  store: MongoStore.create({
    mongoUrl: 'mongodb+srv://mehaknarang75419:' + process.env.PASS+ '@cluster0.6tuitqz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    collectionName: 'sessions' // Optional, default is "sessions"
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 3,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
    httpOnly: true
  }
}))

app.use(flash())

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Middleware to set flash messages for every request
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.user = req.user
  next();
});




app.get("/getSessionData", (req, res) => {
  console.log(req.session);
  res.send(req.session)
})

app.get("/storeUser", (req, res) => {
  req.session.user = {id: 1, name: "Mehak", age: 22}
  res.send("User info stored")
})


main().catch(err => console.log(err));


async function main() {
    await mongoose.connect('mongodb+srv://mehaknarang75419:' + process.env.PASS+ '@cluster0.6tuitqz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
  }

app.use("/listings", listingRouter)
app.use("/listings/:listing_id/reviews", reviewRouter)
app.use("/user", userRouter)


app.get("/", async (req, res, next) => {
  try {
    const listings = await Listing.find();
    res.locals.messages = req.flash("success")
    res.render("listings/index.ejs", { listings});
  } catch (err) {
    next(err);
  }
});



app.get("/showMap", async (req, res) => {
  const url = getMapUrl(49.0504, 122.3045);
  console.log(url);
  // Properly quote the URL in the <img> tag
  res.send(`<img src="${url}" alt="Map Image">`);
});

// app.use((err, req, res, next ) => {
//   let {status = 500, msg = "Some Error Occured"} = err;
//   res.status(status).send(msg);
// })

app.listen(PORT, () => {
    console.log("The server is listening.")
})
