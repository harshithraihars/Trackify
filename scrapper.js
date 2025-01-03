

const express = require("express");
const dotenv=require("dotenv")
const cron=require("node-cron")
const cors = require("cors");
dotenv.config({})
const router = require("./route/productRoute");
const connectDb = require("./db/connectdb");
const { periodicCheck } = require("./periodic");

const app = express();

// Use CORS and JSON parsing middleware before defining routes
app.use(cors()); 
app.use(express.json()); 

// Define routes
app.use("/", router);

const PORT = 3000;

// Connect to the database
connectDb()
  .then(() => {
    // Start the server only after successful DB connection
    app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}...`);
      cron.schedule('0 */6 * * *', () => {
        console.log("Running periodic check...");
        periodicCheck();  // Run the function every minute
      });
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1); // Exit the app if the DB connection fails
  });
