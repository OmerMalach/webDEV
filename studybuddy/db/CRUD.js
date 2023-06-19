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
  summarySearch,
  getStudentDownloads,
};
