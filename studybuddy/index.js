const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const CRUD = require("./db/CRUD");
const sql = require("./db/db");
const cookieParser = require("cookie-parser"); // to install.
const app = express();
const port = 3000;

const Multer = require("multer");
const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // No larger than 5mb, change as you need
  },
});
var now = new Date();
var datetime = now.toISOString().slice(0, 19).replace("T", " ");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "static")));
app.use(cookieParser());

// routing
app.get("/", (req, res) => {
  res.render("LoginPage");
  //res.json({ message: "Welcome to web course example application." });
});
//app.post("/signup", CRUD.createNewUser);
app.post("/LoginPage", CRUD.login);
app.post("/signup", CRUD.createNewUser);

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
app.get("/home", (req, res) => {
  res.render("home", { currentPage: "home" });
});




app.get("/summarySearch", (req, res) => {
  res.render("summarySearch", { currentPage: "summarySearch" });
});
app.get("/theLibrary", (req, res) => {
  res.render("theLibrary", { currentPage: "theLibrary" });
});



app.get("/summeryUpload", (req, res) => {
  res.render("summeryUpload", { currentPage: "summeryUpload" });
});

app.post("/newpost", CRUD.createNewPost);

app.get("/show", CRUD.showAll);
// set port, listen for requests



app.post("/summarySearch", CRUD.summarySearch);

app.post("/mySummaries", CRUD.getStudentDownloads);

const { getStudentDownloads } = require('./db/CRUD');


app.get("/mySummaries", (req, res) => {
  const userId = req.cookies.user_id;

  getStudentDownloads(userId, (err, downloadResults) => {
    if (err) {
      console.log("Error retrieving downloads: ", err);
      res.status(400).send({ message: "Error retrieving downloads: " + err });
      return;
    }

    res.render("mySummaries", { downloads: downloadResults, currentPage: "mySummaries" });
  });
});

app.get('/SearchResults', (req, res) => {
  // Retrieve the summary results from the database
  const query = 'SELECT * FROM Summary WHERE 1=1';
  pool.query(query, (err, results) => {
    if (err) {
      console.error('Error retrieving summary results:', err);
      res.status(400).send({ message: 'Error retrieving summary results: ' + err });
      return;
    }
    res.render('searchResults', { summaries: results });
  });
});

app.get('/recentPosts',CRUD.recentPosts);
app.post("/newcomment", CRUD.createNewComment);













app.listen(port, () => {
  console.log("Server is running on port:", port);
  console.log("Time:", datetime);
});

app.get("/mypost", CRUD.getMyPosts);
app.get("/myUploads", CRUD.myUploads);
app.post("/upload", multer.single("summaryFile"), CRUD.uploadSummaryToCload);
