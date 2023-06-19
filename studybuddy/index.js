const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const CRUD = require("./db/CRUD");
const sql = require("./db/db");
const cookieParser = require("cookie-parser"); // to install.
const app = express();
const port = 3000;
var now = new Date();
var datetime = now.toISOString().slice(0, 19).replace("T", " ");
const { Storage } = require("@google-cloud/storage");
const Multer = require("multer");
const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // No larger than 5mb, change as you need
  },
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "static")));
app.use(cookieParser());

let projectId = "studybuddy-project"; // Get this from Google Cloud
let keyFilename = "mykey.json"; // Get this from Google Cloud -> Credentials -> Service Accounts
const storage = new Storage({
  projectId,
  keyFilename,
});
const bucket = storage.bucket("gstorage-sb"); // Get this from Google Cloud -> Storage
// output a unique id for the uploaded file
// Client side unique ID - This could and probably should move to server with UUID
function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

// Streams file upload to Google Storage
app.post("/upload", multer.single("summaryFile"), (req, res) => {
  console.log("Made it /upload");
  try {
    if (req.file) {
      console.log("File found, trying to upload...");

      // Generate a unique ID for the file
      let postid = uuidv4();

      // Use this ID to construct a new filename
      const newFilename = `${postid}_post.pdf`;

      const blob = bucket.file(newFilename);
      const blobStream = blob.createWriteStream();

      blobStream.on("finish", () => {
        // Construct the URL for the file
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${newFilename}`;

        var now = new Date();
        var datetime = now.toISOString().slice(0, 19).replace("T", " ");

        const newSummary = {
          Name_Summary: req.body.nameOfSummary,
          Course_Number: req.body.courseNumber,
          Course_Name: req.body.nameOfCourse,
          teacher: req.body.Teacher,
          Year: req.body.year,
          Semester: req.body.semester,
          numDownloads: 0,
          uploadDate: datetime,
          summaryUrl: publicUrl,
          uploader_id: 1, // a cookie related shmikel
        };
        console.log(newSummary);
        sql.connection.query(
          "INSERT INTO Summary SET ?",
          newSummary,
          (err, mysqlres) => {
            if (err) {
              console.log("error: ", err);
              res
                .status(400)
                .send({ message: "error in creating Summary: " + err });
              return;
            }
            console.log("created new Summary: ", { id: mysqlres.insertId });
            res.status(200);
            return;
          }
        );
      });

      blobStream.end(req.file.buffer);
    } else throw "error with file";
  } catch (error) {
    console.log("Error uploading file: ", error);
    res.status(500).send(error);
  }
});

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
  res.render("home");
});

app.get("/theLibrary", (req, res) => {
  res.render("theLibrary", { currentPage: "theLibrary" });
});

app.get("/summarySearch", (req, res) => {
  res.render("summarySearch", { currentPage: "summarySearch" });
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



app.listen(port, () => {
  console.log("Server is running on port:", port);
  console.log("Time:", datetime);
});
