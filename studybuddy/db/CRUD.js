const sql = require("./db");

//being called from "createNewUser"
const newUserEmailcheck = async (newUser) => {
  let newEmail = newUser.Email;
  let [selectRes] = await sql.promisePool.query(
    "SELECT * FROM Student WHERE Email = ?",
    newEmail
  );
  if (selectRes.length === 0) {
    return { success: true };
  } else {
    return {
      success: false,
      message:
        "Oops! 😕 Sorry, but there is already a user with this email address.",
    };
  }
};
//being called from "createNewUser"
const newUserNicknamecheck = async (newUser) => {
  let newNickname = newUser.Nickname;
  let [selectRes] = await sql.promisePool.query(
    "SELECT * FROM Student WHERE Nickname = ?",
    newNickname
  );
  if (selectRes.length === 0) {
    return { success: true };
  } else {
    return {
      success: false,
      message:
        "Oops! 😕 Sorry, but there is already a user with this Nickname.",
    };
  }
};

const createNewUser = async (req, res) => {
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
  let emailCheck = await newUserEmailcheck(newUser);
  let nicknameCheck = await newUserNicknamecheck(newUser);
  if (!emailCheck.success) {
    // if there is already an account with that mail
    res.status(403).json(emailCheck); // message will be an alert(in the downloadLogger.js (clint side))
  } else {
    if (!nicknameCheck.success) {
      // if there is already an account with that mail
      res.status(403).json(nicknameCheck); // message will be an alert(in the downloadLogger.js (clint side))
    } else {
      sql.connection.query(
        "INSERT INTO student SET ?",
        newUser,
        (err, mysqlres) => {
          if (err) {
            console.log("error: ", err);
            res.status(400).json({ message: "error in creating user: " + err }); // Change send to json
            return;
          }
          console.log("created new user: ", { id: mysqlres.insertId });
          res.status(201).json({
            id: mysqlres.insertId,
            success: true,
          }); // Send a JSON response
        }
      );
    }
  }
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
      res.cookie("user_credit", mysqlres[0].Credit);
      let userName = req.cookies.user_name;
      res.render("home", {
        v1: userName,
        v2: mysqlres[0].Credit,
      }); // Render the home.pug template
      getStudentDownloads(studentId, (downloadErr, downloadResults) => {
        if (downloadErr) {
          console.log("Error retrieving downloads: ", downloadErr);
          res
            .status(400)
            .send({ message: "Error retrieving downloads: " + downloadErr });
          return;
        }

        res.render("home", { v1: mysqlres[0].Nickname, downloads: downloadResults, loggedInUser: mysqlres[0].Nickname });

      });
    }
  );
};
const getMyPosts = (req, res) => {
  const q = `
    SELECT * 
    FROM post 
    WHERE post.Poster_ID = ?
  `;
  let userID = req.cookies.user_id;
  sql.connection.query(q, userID, (error, results) => {
    if (error) {
      res.status(500).json({ message: error.message });
      return;
    }
    let posts = results;
    const commentsQuery = `
      SELECT *
      FROM comment
      JOIN Student ON comment.Student_ID = Student.ID
      WHERE a = ?
    `;
    Promise.all(
      posts.map((post) => {
        return new Promise((resolve, reject) => {
          sql.connection.query(
            commentsQuery,
            post.Post_ID,
            (error, results) => {
              if (error) {
                reject(error);
                return;
              }
              post.comments = results;
              resolve(post);
            }
          );
        });
      })
    )
      .then((postsWithComments) => {
        res.json(postsWithComments);
      })
      .catch((error) => {
        res.status(500).json({ message: error.message });
      });
  });
};

/// this part is responsible of uploading the summaries to the cloud and log them in the database.
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
const uploadToCloud = async (file, body, userId) => {
  let postid = uuidv4();
  const newFilename = `${postid}_post.pdf`;
  const blob = bucket.file(newFilename);
  const blobStream = blob.createWriteStream({
    metadata: {
      contentType: file.mimetype, // Ensure you're setting the correct MIME type
      contentDisposition: "attachment", // by doing so - the files would download instead of being opened on a new tab
    },
  });
  return new Promise((resolve, reject) => {
    blobStream.on("error", reject);
    blobStream.on("finish", () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${newFilename}`;
      var now = new Date();
      var datetime = now.toISOString().slice(0, 19).replace("T", " ");
      const newSummary = {
        Name_Summary: body.nameOfSummary,
        Course_Number: body.courseNumber,
        Course_Name: body.nameOfCourse,
        teacher: body.Teacher,
        Year: body.year,
        Semester: body.semester,
        numDownloads: 0,
        uploadDate: datetime,
        summaryUrl: publicUrl,
        uploader_id: userId,
      };
      resolve(newSummary);
    });
    blobStream.end(file.buffer);
  });
};

const insertIntoDatabase = async (newSummary) => {
  let [mysqlres] = await sql.promisePool.query(
    "INSERT INTO Summary SET ?",
    newSummary
  );
  return mysqlres.insertId;
};

const addCredit = async (userID) => {
  await sql.promisePool.query(
    "UPDATE Student SET Credit = Credit + 1 WHERE ID = ?",
    userID
  );
  let [selectRes] = await sql.promisePool.query(
    "SELECT * FROM Student WHERE ID = ?",
    userID
  );
  return selectRes[0];
};

const uploadSummaryToCload = async (req, res) => {
  try {
    if (!req.file) throw "error with file";
    console.log("File found, trying to upload...");
    const userId = req.cookies.user_id; // extract user_id from cookies here
    const newSummary = await uploadToCloud(req.file, req.body, userId); // pass userId as a parameter
    console.log(newSummary);
    const insertId = await insertIntoDatabase(newSummary);
    console.log("created new Summary: ", { id: insertId });
    const updatedUser = await addCredit(userId);
    console.log("Updated student: ", updatedUser);
    res.cookie("user_credit", updatedUser.Credit); // updating the credit within cookie storage
    res.redirect("summeryUpload");
  } catch (error) {
    console.log("Error uploading file: ", error);
    res.status(500).send(error);
  }
};

const myUploads = (req, res) => {
  const q = `
  SELECT * 
  FROM Summary
  WHERE Summary.uploader_id = ?
`;
  let userID = req.cookies.user_id;
  sql.connection.query(q, userID, (error, results) => {
    if (error) {
      res.status(500).json({ message: error.message });
    } else {
      res.json(results);
    }
  });
};

const summarySearch = (req, res) => {
  const courseNumber = req.body.courseNumber || "";
  const nameOfCourse = req.body.nameOfCourse || "";
  const year = req.body.year || "";
  const semester = req.body.semester || "";

  // Prepare the SQL query
  let query = "SELECT * FROM Summary WHERE 1=1";

  // Add filters based on the provided inputs
  const filters = [];
  if (courseNumber) {
    query += " AND Course_Number = ?";
    filters.push(courseNumber);
  }
   if (nameOfCourse) {
    query += " AND Course_Name  = ?";
    filters.push(nameOfCourse);
  }
  if (year) {
    query += " AND Year = ?";
    filters.push(year);
  }
  if (semester) {
    query += " AND Semester = ?";
    filters.push(semester);
  }

  // Execute the SQL query
  sql.connection.query(query, filters, (err, results) => {
    if (err) {
      console.error("Error in summary search:", err);
      res.status(400).send({ message: "Error in summary search: " + err });
      return;
    }
    res.render("SearchResults", {
      summaries: results,
      v1: req.cookies.user_credit,
    });
  });
};

const takeCredit = async (userID) => {
  await sql.promisePool.query(
    "UPDATE Student SET Credit = Credit - 1 WHERE ID = ?",
    userID
  );
  let [selectRes] = await sql.promisePool.query(
    "SELECT * FROM Student WHERE ID = ?",
    userID
  );
  return selectRes[0];
};

const checkCredit = async (userID) => {
  let [selectRes] = await sql.promisePool.query(
    "SELECT * FROM Student WHERE ID = ?",
    userID
  );
  let user = selectRes[0];
  if (user.Credit <= 0) {
    return {
      success: false,
      message:
        "We're sorry, but you've used all of your credit. Upload a summary of your own and help the community grow - you'll also earn credit for your hard work! 💪🤓",
    };
  } else {
    return { success: true };
  }
};

const downloadTracker = async (req, res) => {
  var summaryID = req.body.summaryId;
  var userID = req.cookies.user_id;
  let creditCheck = await checkCredit(userID);
  if (!creditCheck.success) {
    // if there is no credit (credit =0)
    res.status(403).json(creditCheck); // message will be an alert(in the downloadLogger.js (clint side))
  } else {
    // user has credit!, proceed with download
    var now = new Date();
    var datetime = now.toISOString().slice(0, 19).replace("T", " ");
    try {
      // Check if the download record already exists
      const checkSql =
        "SELECT * FROM Download WHERE Summary_ID = ? AND Student_ID = ?";
      const [results] = await sql.promisePool.query(checkSql, [
        summaryID,
        userID,
      ]);
      if (results.length > 0) {
        // The download record already exists
        return res.status(400).send({
          message:
            "You've already downloaded this summary. You can find all of your downloaded summaries within My Summaries Tab ;) ",
        });
      }
      const q = "INSERT INTO Download SET ?";
      const newDownloadRecord = {
        Summary_ID: summaryID,
        Student_ID: userID,
        Date_of_download: datetime,
      };
      await sql.promisePool.query(q, newDownloadRecord);
      const updatedUser = await takeCredit(userID);
      res.cookie("user_credit", updatedUser.Credit); // updating the credit within cookie storage
      console.log("Updated student: ", updatedUser);
      res.status(200).send({ message: "Download tracked successfully" });
    } catch (error) {
      console.error("Error tracking download: ", error);
      res.status(500).send({ error: "Error tracking download" });
    }
  }
};

function getStudentDownloads(user_id, callback) {
  const query = `
    SELECT s.Name_Summary, s.Course_Number, s.Course_Name, s.teacher, s.Year, s.Semester, s.uploadDate, s.summaryUrl
    FROM Summary s
    JOIN Download d ON s.Summary_ID = d.Summary_ID
    WHERE d.Student_ID = ?
  `;

  sql.connection.query(query, [user_id], (err, results) => {
    if (err) {
      callback(err);
      return;
    }

    const downloads = results.map((row) => {
      return {
        name: row.Name_Summary,
        courseNumber: row.Course_Number,
        courseName: row.Course_Name,
        teacher: row.teacher,
        year: row.Year,
        semester: row.Semester,
        uploadDate: row.uploadDate,
        summaryUrl: row.summaryUrl,
      };
    });

    console.log("Downloaded summaries: ", downloads);
    callback(null, downloads);
  });
}


const getLibraryPosts = (req, res) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const q = `
    SELECT post.*, Student.Nickname AS Nickname, Student.Email AS Email
    FROM Post
    JOIN Student ON Post.Poster_ID = Student.ID
    WHERE Post.DateTime >= ?;
  `;
  const params = [thirtyDaysAgo];

  sql.connection.query(q, params, (error, results) => {
    if (error) {
      if (!res.headersSent) {
        res.status(500).json({ message: error.message });
      }
      return;
    }

    let posts = results;
    const commentsQuery = `
      SELECT *
      FROM Comment
      JOIN Student ON Comment.Student_ID = Student.ID
      WHERE Comment.Post_ID = ?
    `;
    let responseSent = false;

    Promise.all(
      posts.map((post) => {
        return new Promise((resolve, reject) => {
          sql.connection.query(
            commentsQuery,
            post.Post_ID,
            (error, results) => {
              if (error) {
                reject(error);
                return;
              }
              post.comments = results;
              resolve(post);
            }
          );
        });
      })
    )
      .then((postsWithComments) => {
        if (!responseSent) {
          res.json(postsWithComments);
          responseSent = true;
        }
      })
      .catch((error) => {
        if (!responseSent) {
          res.status(500).json({ message: error.message });
          responseSent = true;
        }
      });
  });
};
const addComment = (req, res) => {
  const { postID, comment } = req.body;
  const studentID = req.cookies.userID; // Assuming the student ID is stored in a cookie

  // Insert the new comment into the database
  const q = `
    INSERT INTO Comment (Post_ID, Student_ID, Text, DateTime)
    VALUES (?, ?, ?, NOW())
  `;
  const params = [postID, studentID, comment];

  sql.connection.query(q, params, (error, result) => {
    if (error) {
      res.status(500).json({ message: error.message });
      return;
    }

    // Retrieve the inserted comment from the database
    const commentQuery = `
      SELECT Comment.*, Student.Nickname AS Nickname, Student.Email AS Email
      FROM Comment
      JOIN Student ON Comment.Student_ID = Student.ID
      WHERE Comment.ID = ?;
    `;
    const commentID = result.insertId;

    sql.connection.query(commentQuery, commentID, (error, result) => {
      if (error) {
        res.status(500).json({ message: error.message });
        return;
      }

      const newComment = result[0];
      res.json({ comment: newComment });
    });
  });
};

module.exports = {
  createNewUser,
  createNewPost,
  createNewdownload,
  login,
  getMyPosts,
  uploadSummaryToCload,
  myUploads,
  summarySearch,
  downloadTracker,
  getStudentDownloads,
  getLibraryPosts,
  createNewComment,
};
