const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const CRUD = require("./db/CRUD");
const cookieParser = require("cookie-parser"); // to install.
const app = express();
const upload = multer({ dest: "uploads/" });

const multer = require("multer");
const { google } = require("googleapis");
const { OAuth2Client } = require("google-auth-library");
const fs = require("fs");
const sql = require("./db");
const CLIENT_ID: '400315462079-13dgnaqavlnficsh8saoq97pqbajfk99.apps.googleusercontent.com';
const CLIENT_secret='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';
const REDIRECT_URI= 'https:/developers.google.com/oauthplayground';
const REFRESH_TOKEN= '1//04GZSwD6ILCZaCgYIARAAGAQSNwF-L9IrkNe0din7KTbV-TzOZY8IUu0ln-VV0IP7brmOLctjEb-2ENbv6Bjr-qB49Z6wc9BRD-o'

const oauth2Client= new google.auth.oAuth2(
CLIENT_ID,
CLIENT_secret,
REDIRECT_URI
);
oauth2Client.setCredentials({refresh_token: REFRESH_TOKEN})

const drive= google.drive({
version: 'v3',
auto:oauth2Client
})

const filePath= path.join(__dirname, )

async function uploadFile(){
try{
const response= await drive.files.create({
requestBody: {
name:
mimeType:
},
media:{
mimeType:
body: fs.createReadStream(filePath)
 }
})
 console.log(response.data)
} catch(error){
console.log(error.message)
 }
}

uploadFile();


async function deleteFile(){
try{
const response= await drive.files.delete({
fileId :

});
console.log(response.data ,response.status)
} catch (error){
console.log(error.message);
 }
}
deleteFile();

async function generatePublic (){
try{
const fileId=
await drive.permissions.create({
fileId:
requestBody:{
role:'reader',
type: 'anyone'
 }
})
const result =await drive.files.get({
fileId: fileId,
fields: 'webViewLink' ,'webContentLink',
});
console.log.(result.data);

} catch (error){
console.log(error.message)
  }
}
generatePublic ();

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
