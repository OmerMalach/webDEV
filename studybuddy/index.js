const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const CRUD = require("./db/CRUD");
const app = express();
const cookieParser = require("cookie-parser"); // to install.
const port = 3000;
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "static")));
app.use(cookieParser());

// routing
app.get("/", (req, res) => {
  //res.json({ message: "Welcome to web course example application." });
  res.sendFile(path.join(__dirname, "views/NewAccount.html"));
});

// set port, listen for requests
app.listen(port, () => {
  console.log("Server is running on port:", port);
});

app.post("/signup", CRUD.createNewUser);

app.post("/newpost", CRUD.createNewPost);

app.get("/show", CRUD.showAll);

const multer = require("multer");
const { google } = require("googleapis");
const { OAuth2Client } = require("google-auth-library");
const fs = require("fs");
const path = require("path");
const mysql = require("mysql");

const app = express();
const upload = multer({ dest: "uploads/" });

const db = mysql.createConnection({
  host: "your-database-host",
  user: "your-database-user",
  password: "your-database-password",
  database: "your-database-name",
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Connected to MySQL database");
});

const oauth2Client = new OAuth2Client(
  "your-client-id",
  "your-client-secret",
  "your-redirect-uri"
);

oauth2Client.setCredentials({ refresh_token: "your-refresh-token" });

const drive = google.drive({
  version: "v3",
  auth: oauth2Client,
});

app.post("/upload", upload.single("file"), async (req, res) => {
  const filePath = path.join(__dirname, req.file.path);
  const { name, mimetype } = req.file;

  try {
    const response = await drive.files.create({
      requestBody: {
        name,
        mimeType: mimetype,
      },
      media: {
        mimeType: mimetype,
        body: fs.createReadStream(filePath),
      },
    });

    fs.unlinkSync(filePath);

    // Extract File ID from the Google Drive response
    const fileId = response.data.id;

    // Get the shareable link of the file.
    const driveResponse = await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    if (driveResponse.status === 200) {
      const summaryUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

      // These values should be taken from your application state or the upload request
      const values = [
        "Summery_ID",
        "Name_Summery",
        "Course_Number",
        "teacher",
        "Year",
        "semester",
        "rnk",
        "numDownloads",
        "uploadDate",
        summaryUrl,
        "uploader_id",
      ];

      const sqlQuery = `INSERT INTO Summery (Summery_ID, Name_Summery, Course_Number, teacher, Year, semester, rnk, numDownloads, uploadDate, summaryUrl, uploader_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      db.query(sqlQuery, values, (err, result) => {
        if (err) {
          throw err;
        } else {
          console.log(result);
        }
      });

      res.status(200).json({ fileId: fileId, summaryUrl: summaryUrl });
    } else {
      res
        .status(500)
        .json({ error: "Error occurred while trying to share file" });
    }
  } catch (error) {
    fs.unlinkSync(filePath);
    res
      .status(400)
      .json({ error: "Error occurred while trying to upload file" });
  }
});

app.listen(3000, () => console.log("App listening on port 3000"));
