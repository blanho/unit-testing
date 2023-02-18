import express from "express";
const app = express();
import connectDatabase from "./config/database.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();

// Setup body parser
app.use(express.json());

// Set cookie parser
app.use(cookieParser());

// Importing all routes
import auth from "./routes/auth.js";
import jobs from "./routes/jobs.js";

connectDatabase();

app.use("/api/v1", auth);
app.use("/api/v1", jobs);
app.all("*", (req, res) => {
  return res.status(404).json({
    error: `Route not found`,
  });
});

const PORT = 5000 || process.env.PORT;

app.listen(PORT, () => {
  console.log(
    `Server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode.`
  );
});
