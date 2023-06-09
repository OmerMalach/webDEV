const upload = multer({ dest: "uploads/" });
const multer = require("multer");
const { google } = require("googleapis");
const { OAuth2Client } = require("google-auth-library");
const fs = require("fs");

const CLIENT_ID: '400315462079-13dgnaqavlnficsh8saoq97pqbajfk99.apps.googleusercontent.com';
const CLIENT_secret='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';
const REDIRECT_URI= 'https:/developers.google.com/oauthplayground';
const REFRESH_TOKEN= '1//04GZSwD6ILCZaCgYIARAAGAQSNwF-L9IrkNe0din7KTbV-TzOZY8IUu0ln-VV0IP7brmOLctjEb-2ENbv6Bjr-qB49Z6wc9BRD-o'


const oauth2Client= new google.auth.oAuth2(
CLIENT_ID,
CLIENT_secret,
REDIRECT_URI);

oauth2Client.setCredentials({refresh_token: REFRESH_TOKEN})

const drive= google.drive({
version: 'v3',
auto:oauth2Client
})

// Handle the file upload endpoint
app.post("/upload", upload.single("file"), async (req, res) => {
    try {
      const file = req.file;
  
      // Validate the file and form data here
  
      // Get the file name and MIME type
      const fileName = file.originalname;
      const mimeType = file.mimetype;
  
      // Create the request body for uploading the file
      const requestBody = {
        name: fileName,
        mimeType: mimeType
      };
  
      // Specify the file path on the server
      const filePath = file.path;
  
      // Upload the file to Google Drive
      const response = await drive.files.create({
        requestBody: requestBody,
        media: {
          mimeType: mimeType,
          body: fs.createReadStream(filePath)
        }
      });





/*

// Handle the file upload endpoint
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;

    // Validate the file and form data here

    // Get the file name and MIME type
    const fileName = file.originalname;
    const mimeType = file.mimetype;

    // Create the request body for uploading the file
    const requestBody = {
      name: fileName,
      mimeType: mimeType
    };

    // Specify the file path on the server
    const filePath = file.path;

    // Upload the file to Google Drive
    const response = await drive.files.create({
      requestBody: requestBody,
      media: {
        mimeType: mimeType,
        body: fs.createReadStream(filePath)
      }
    });

*/




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





