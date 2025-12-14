import dotenv from "dotenv";
dotenv.config();

import app from "@/app";
import { connectDB } from "@/config/db";
// Import all models to ensure they are registered with Mongoose
// This must be imported before any populate() calls
import "@/models";

const PORT: number = parseInt(process.env.PORT || "5000", 10);

const startServer = async (): Promise<void> => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

startServer();
