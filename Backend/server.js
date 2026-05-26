const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables properly using dotenv
dotenv.config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Enable CORS correctly
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("InviteStudio Backend Running");
});

const PORT = process.env.PORT || 5000;

// Verify MongoDB connection works before server startup
const startServer = async () => {
  try {
    console.log("Connecting to MongoDB database...");
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Critical: Failed to establish database connection. Server startup aborted.", error);
    process.exit(1);
  }
};

startServer();