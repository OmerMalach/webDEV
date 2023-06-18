const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const CRUD = require("./db/CRUD");
const cookieParser = require("cookie-parser"); // to install.
const app = express();
const port = 3000;
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const cors = require("cors"); // not sure if needed
app.set('views',path.join(__dirname,'views'));
app.set('view engine', 'pug');
const mysql = require('mysql');





const { google } = require("googleapis");
const { OAuth2Client } = require("google-auth-library");
const fs = require("fs");

const CLIENT_ID = '400315462079-13dgnaqavlnficsh8saoq97pqbajfk99.apps.googleusercontent.com';
const CLIENT_secret = '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';
const REDIRECT_URI = 'https:/developers.google.com/oauthplayground';
const REFRESH_TOKEN ='1//04GZSwD6ILCZaCgYIARAAGAQSNwF-L9IrkNe0din7KTbV-TzOZY8IUu0ln-VV0IP7brmOLctjEb-2ENbv6Bjr-qB49Z6wc9BRD-o';

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_secret,
  REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({
  version: "v3",
  auto: oauth2Client,
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "static")));
app.use(cookieParser());
var now = new Date();
var datetime = now.toISOString().slice(0, 19).replace("T", " ");

// routing
app.get("/", (req, res) => {
 res.render('LoginPage');
  //res.json({ message: "Welcome to web course example application." });
});
//app.post("/signup", CRUD.createNewUser);
app.post("/LoginPage", CRUD.login);


app.post("/signup", CRUD.createNewUser);



//app.get("/", (req, res) => {
  //res.json({ message: "Welcome to web course example application." });
  //res.sendFile(path.join(__dirname, "views/summeryUpload.html"));
//});

app.get("/new-account", (req, res) => {
  res.render("newAccount");
});

// Route for the Forgot Password page
app.get("/forgot-password", (req, res) => {
  res.render("ForgetPassword");
});
// Route for the Contact Us page
app.get("/contact-us", (req, res) => {
  res.render("contactUs");
});

// Route for the About Us page
app.get("/about-us", (req, res) => {
  res.render("AboutUs");
});
app.get('/home', (req, res) => {
  res.render('home');
});

app.get('/theLibrary', (req, res) => {
  res.render('theLibrary', { currentPage: 'theLibrary' });
});

app.get('/summarySearch', (req, res) => {
  res.render('summarySearch', { currentPage: 'summarySearch' });
});

app.get('/mySummaries', (req, res) => {
  res.render('mySummaries', { currentPage: 'mySummaries' });
});

app.get('/summeryUpload', (req, res) => {
  res.render('summeryUpload', { currentPage: 'summeryUpload' });
});



app.post("/newpost", CRUD.createNewPost);

//app.post("/newsummary", CRUD.createNewSummary);



app.get("/show", CRUD.showAll);
// set port, listen for requests
app.listen(port, () => {
  console.log("Server is running on port:", port);
  console.log("Time:", datetime);
});



