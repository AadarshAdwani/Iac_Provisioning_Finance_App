import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import incomeRoutes from "./routes/incomeRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";

import authenticateUser from "./middlewares/authenticateUser.js";

// Load environment variables
dotenv.config();

// App Configuration
const PORT = process.env.PORT || 5000;
const app = express();

// --- Middlewares ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- CORS Configuration ---
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:80",
    "https://spend-smart-dev.vercel.app"
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// --- Routes ---
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/incomes", authenticateUser, incomeRoutes);
app.use("/api/v1/expenses", authenticateUser, expenseRoutes);

// --- Error Handling for 404s ---
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// --- Start Server ---
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server started on PORT ${PORT}!`);
    });
  } catch (error) {
    console.log(`❌ Error in starting the server: ${error.message}`);
    process.exit(1);
  }
};

startServer();