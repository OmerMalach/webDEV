const mysql = require("mysql2");
const dbConfig = require("./db.config.js");
// Create a connection to the database
const connection = mysql.createConnection({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
});

const oauth2Client = new OAuth2Client(
  "your-client-id",
  "your-client-secret",
  "your-redirect-uri"
);

// open the MySQL connection
connection.connect((error) => {
  if (error) throw error;
  console.log("Successfully connected to the database.");
});
module.exports = { connection, oauth2Client };
