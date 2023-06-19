const sql = require("./db");

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

  sql.connection.query(
    "INSERT INTO student SET ?",
    newUser,
    (err, mysqlres) => {
      if (err) {
        console.log("error: ", err);
        res.status(400).send({ message: "error in creating user: " + err });
        return;
      }

      console.log("created new user: ", { id: mysqlres.insertId });
      res.render("LoginPage"); // Render the LoginPage.pug template
      return;
    }
  );
};

const createNewPost = (req, res) => {
  // get datetime
  var now = new Date();
  var datetime = now.toISOString().slice(0, 19).replace("T", " ");
  // Validate request
  if (!req.body.post) {
    res.status(400).send({
      message: "Post can not be empty!",
    });
    return;
  }
  const newPost = {
    DateTime: datetime,
    Text: req.body.post,
    Poster_ID: req.cookies.user_id, // where should i get it from????
  };
  sql.connection.query("INSERT INTO Post SET ?", newPost, (err, mysqlres) => {
    if (err) {
      console.log("error: ", err);
      res.status(400).send({ message: "error in creating post: " + err });
      return;
    }
    console.log("created new post: ", { id: mysqlres.insertId });
    return;
  });
  res.redirect("home");
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
  if (!req.body || !req.body.username || !req.body.password) {
    res.render("loginPage", { error: "Username or password can't be empty!" });
    return;
  }

  const username = req.body.username;
  const password = req.body.password;

  sql.connection.query(
    "SELECT * FROM student WHERE Nickname = ? AND Password = ?",
    [username, password],
    (err, mysqlres) => {
      if (err) {
        console.log("Error: ", err);
        res.status(400).send({ message: "Error in login: " + err });
        return;
      }

      if (mysqlres.length === 0) {
        // User not found in the database
        res.render("loginPage", { error: "Invalid username or password" });
        return;
      }

      const studentId = mysqlres[0].ID;

      console.log("Login success: ", { username: mysqlres[0].Nickname });
      res.cookie("user_name", mysqlres[0].Nickname);
      res.cookie("user_id", mysqlres[0].ID);
      let userName = req.cookies.user_name;
      res.render("home", {
        v1: userName,
      }); // Render the home.pug template

      res.cookie("user_name", mysqlres[0].Nickname);
      res.cookie("user_id", studentId);

      getStudentDownloads(studentId, (downloadErr, downloadResults) => {
        if (downloadErr) {
          console.log("Error retrieving downloads: ", downloadErr);
          res.status(400).send({ message: "Error retrieving downloads: " + downloadErr });
          return;
        }

        res.render("home", { downloads: downloadResults }); // Pass the downloaded summaries to the home.pug template
      });
    }
  );
};

const getMyPosts = (req, res) => {
  const q = `
  SELECT * 
  FROM post 
  INNER JOIN student ON post.Poster_ID = student.id 
  WHERE post.Poster_ID = ?
`;
  let userID = req.cookies.user_id;
  console.log(userID);
  sql.connection.query(q, userID, (error, results) => {
    if (error) {
      res.status(500).json({ message: error.message });
    } else {
      res.json(results);
    }
  });
};

/// this part is responsible of uploading the summaries to the cloud and log them in the database.
var now = new Date();
var datetime = now.toISOString().slice(0, 19).replace("T", " ");
const { Storage } = require("@google-cloud/storage");

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
const uploadSummaryToCload = (req, res) => {
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
          // inserting to summary table
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
        let userID = req.cookies.user_id;
        sql.connection.query(
          "UPDATE Student SET Credit = Credit + 1 WHERE ID = ?",
          userID,
          (err, mysqlres) => {
            if (err) {
              console.log("error: ", err);
              res
                .status(400)
                .send({ message: "error in updating student credit: " + err });
              return;
            }
            console.log("updated credit of: ", { id: mysqlres.insertId });
            res.status(200);
            return;
          }
        );
      });

      blobStream.end(req.file.buffer);
      redirect("summeryUpload");
    } else throw "error with file";
  } catch (error) {
    console.log("Error uploading file: ", error);
    res.status(500).send(error);
  }
};

const myUploads = (req, res) => {
  const q = `
  SELECT * 
  FROM Summary
  INNER JOIN student ON Summary.uploader_id = Student.id 
  WHERE Summary.uploader_id = ?
`;
  let userID = req.cookies.user_id;
  console.log(userID);
  sql.connection.query(q, userID, (error, results) => {
    if (error) {
      res.status(500).json({ message: error.message });
    } else {
      res.json(results);
    }
  });
};


const summarySearch = (req, res) => {
  const courseNumber = req.body.courseNumber || '';
  const year = req.body.year || '';
  const semester = req.body.semester || '';

  // Prepare the SQL query
  let query = 'SELECT * FROM Summary WHERE 1=1';

  // Add filters based on the provided inputs
  const filters = [];
  if (courseNumber) {
    query += ' AND Course_Number = ?';
    filters.push(courseNumber);
  }
  if (year) {
    query += ' AND Year = ?';
    filters.push(year);
  }
  if (semester) {
    query += ' AND Semester = ?';
    filters.push(semester);
  }

  // Execute the SQL query
 sql.connection.query(query, filters, (err, results) => {
    if (err) {
      console.error('Error in summary search:', err);
      res.status(400).send({ message: 'Error in summary search: ' + err });
      return;
    }
    res.render('SearchResults', { summaries: results });
  });
};

function getStudentDownloads(user_id, callback) {
  // Use the `userId` to retrieve the downloaded summaries specific to the user from your database
  // Perform the necessary database query to retrieve the summaries

  // Example query using MySQL2 library
  const query = 'SELECT * FROM Summary WHERE uploader_id = ?';

  // Assuming you have a MySQL connection pool defined and stored in a variable called `pool`
   sql.connection.query(query, [user_id], (err, results) => {
    if (err) {
      callback(err); // Pass the error to the callback
      return;
    }

    const summaries = results.map(row => {
  return {
    Name_Summary: row.name,
    Course_Number: row.courseNumber,
    Course_Name: row.courseName,
    teacher: row.teacher,
    Year: row.year,
    Semester: row.semester,
    uploadDate: row.uploadDate,
    summaryUrl: row.summaryUrl
  };
});
    console.log("Downloaded summaries: ", results);

    callback(null, summaries); // Pass the summaries array to the callback
  });
}






module.exports = {
  createNewUser,
  createNewPost,
  createNewdownload,
  showAll,
  login,
  getMyPosts,
  uploadSummaryToCload,
  myUploads, // Add the login function to the exports
  summarySearch,
  getStudentDownloads,
};
