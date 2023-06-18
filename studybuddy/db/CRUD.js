const sql = require("./db");
const path = require("path");
const Gdrive = require("./Gdrive");
const mysql = require('mysql');


//post
const createNewUser = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  const newUser = {
    Nickname: req.body.username,
    Email: req.body.email,
    Password: req.body.password,
    Phone_number: req.body.phone,
  };

  sql.connection.query("INSERT INTO student SET ?", newUser, (err, mysqlres) => {
    if (err) {
      console.log("error: ", err);
      res.status(400).send({ message: "error in creating user: " + err });
      return;
    }

    console.log("created new user: ", { id: mysqlres.insertId });
    res.render("LoginPage"); // Render the LoginPage.pug template
    return;
  });
};

const createNewPost = (req, res) => {
  // get datetime
  var now = new Date();
  var datetime = now.toISOString().slice(0, 19).replace("T", " ");
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Post can not be empty!",
    });
    return;
  }
  const newPost = {
    DateTime: datetime,
    Text: req.body.post,
    Poster_ID: 1, // where should i get it from????
  };

  sql.query("INSERT INTO Post SET ?", newPost, (err, mysqlres) => {
    if (err) {
      console.log("error: ", err);
      res.status(400).send({ message: "error in creating post: " + err });
      return;
    }
    console.log("created new post: ", { id: mysqlres.insertId });
    return;
  });
};

const createNewSummary = async (req, res) => {
  // Validate request maybe we should add some more checks
  if (!req.body || !req.file) {
    console.log(req.file);
    if (!req.file) {
      res.status(400).send({
        message:
          "Summary details cccccccc or the actual file can not be empty!",
      });
      return;
    }
    res.status(400).send({
      message: "Summary details or the actual file can not be empty!",
    });
    return;
  }
  try {
    console.log("try1");
    var summary = req.file;
    var sumURL = await GdriveUpload(summary);
    console.log("try2");
    var now = new Date();
    var datetime = now.toISOString().slice(0, 19).replace("T", " ");

    const newSummary = {
      Name_Summery: req.body.nameOfSummary,
      Course_Number: req.body.courseNumber,
      Course_Name: req.body.nameOfCourse,
      teacher: req.body.post,
      Year: req.body.year,
      Semester: req.body.semester,
      numDownloads: 0,
      uploadDate: datetime,
      summaryUrl: sumURL,
      uploader_id: req.body.post, // a cookie related shmikel
    };

    sql.query("INSERT INTO Summary SET ?", newSummary, (err, mysqlres) => {
      if (err) {
        console.log("error: ", err);
        res.status(400).send({ message: "error in creating Summary: " + err });
        return;
      }
      console.log("created new Summary: ", { id: mysqlres.insertId });
      return;
    });
  } catch (err) {
    console.log("Error uploading file: ", err);
    res.status(500).send({ message: "Error uploading file: " + err });
    return;
  }
};

const createNewdownload = (req, res) => {
  // get datetime
  var now = new Date();
  var datetime = now.toISOString().slice(0, 19).replace("T", " ");
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "downloads (mysummaries) can not be empty!",
    });
    return;
  }
  const newDownload = {
    Student_ID: req.body,
    Summary_ID: req.body,
    DateTime: datetime,
  };

  sql.query("INSERT INTO Download SET ?", newDownload, (err, mysqlres) => {
    if (err) {
      console.log("error: ", err);
      res
        .status(400)
        .send({ message: "error in creating Download (mysummaries): " + err });
      return;
    }
    console.log("created new Download: ", { id: mysqlres.insertId });
    return;
  });
};

//get
const showAll = (req, res) => {
  sql.query("SELECT * FROM student", (err, mysqlres) => {
    if (err) {
      console.log("error: ", err);
      res.status(400).send({ message: "error in select all users : " + err });
      return;
    }
    console.log("got all users...");
    res.send(mysqlres);
    return;
  });
};



const login = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  const newlogin = {
    Nickname: req.body.username,
    Password: req.body.password,
  };

  sql.connection.query("SELECT * FROM student WHERE Nickname = '" + req.body.username + "' AND Password = '" + req.body.password + "'", newlogin, (err, mysqlres) => {
    if (err) {
      console.log("error: ", err);
      res.status(400).send({ message: "error in login: " + err });
      return;
    }

    console.log("login success: ", { username: mysqlres[0].Nickname });
    res.render("home"); // Render the LoginPage.pug template
    return;
  });
};







module.exports = {
  createNewUser,
  createNewPost,
  createNewSummary,
  createNewdownload,
  showAll,
  login, // Add the login function to the exports
};










