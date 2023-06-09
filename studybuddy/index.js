const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const CRUD = require("./db/CRUD");
const cookieParser = require("cookie-parser"); // to install.
const app = express();
const sql = require("./db");
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

app.post("/newsummary", CRUD.createNewSummary);

app.get("/show", CRUD.showAll);
