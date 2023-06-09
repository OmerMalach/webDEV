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

app.use(cors()); // not sure if needed
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "static")));
app.use(cookieParser());
var now = new Date();
var datetime = now.toISOString().slice(0, 19).replace("T", " ");

// routing
app.get("/", (req, res) => {
  //res.json({ message: "Welcome to web course example application." });
  res.sendFile(path.join(__dirname, "views/summeryUpload.html"));
});

// set port, listen for requests
app.listen(port, () => {
  console.log("Server is running on port:", port);
  console.log("Time:", datetime);
});

app.post("/signup", CRUD.createNewUser);

app.post("/newpost", CRUD.createNewPost);

//app.post("/newsummary", CRUD.createNewSummary);

// Use multer middleware in your route
app.post(
  "/newsummary",
  upload.single("file"),
  CRUD.createNewSummary,
  function (err, req, res, next) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      res.status(500).send({ message: "Error uploading file." });
    } else if (err) {
      // An unknown error occurred when uploading.
      res.status(500).send({ message: "Unknown error occurred." });
    }
  }
);

app.get("/show", CRUD.showAll);
