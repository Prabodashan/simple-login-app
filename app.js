// Third-party libraries & modules
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const authRoute = require("./routes/Login");

const app = express();
const PORT = 3300;

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Connection Successfully!"))
  .catch((err) => console.log(err));

// Common middleware
app.use(cors());
app.use(express.json());

// Base route
app.get("/", (req, res) => {
  res.status(200).json({ success: { message: `Welcome to the server!` } });
});

//autoload routes
app.use("/api/auth", authRoute);

// Error route
app.use((req, res) => {
  res.status(404).json({ error: { message: `Not found!` } });
});

// Initialize the connection
app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
