const sql = require("./db");
const path = require("path");

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
  sql.query("INSERT INTO student SET ?", newUser, (err, mysqlres) => {
    if (err) {
      console.log("error: ", err);
      res.status(400).send({ message: "error in creating user: " + err });
      return;
    }
    console.log("created new user: ", { id: mysqlres.insertId });
    res.sendFile(path.join(__dirname, "../views/LoginPage.html"));
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

const createNewSummary = (req, res) => {
  var now = new Date();
  var datetime = now.toISOString().slice(0, 19).replace("T", " ");
  // Validate request maybe we should add some more checks
  if (!req.body) {
    res.status(400).send({
      message: "Summary can not be empty!",
    });
    return;
  }

  const newSummary = {
    Name_Summery: req.body.nameOfSummary,
    Course_Number: req.body.courseNumber,
    Course_Number: req.body.nameOfCourse,
    teacher: req.body.post,
    Year: req.body.year,
    Semester: req.body.semester,
    numDownloads: 0,
    uploadDate: req.body.datetime,
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
module.exports = {
  createNewUser,
  createNewPost,
  createNewSummary,
  createNewdownload,
  showAll,
};
