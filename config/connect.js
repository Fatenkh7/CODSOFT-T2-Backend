import mongoose from "mongoose";
import dotenv from "dotenv";
import session from "express-session"; // Import the express-session middleware
import MongoDBStore from "connect-mongodb-session"; // Import connect-mongodb-session

dotenv.config();

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);
    const conn = await mongoose.connect(process.env.MONGO, {
      useUnifiedTopology: true,
      dbName: process.env.DB_NAME,
    });
    console.log(`Connected to: ${conn.connection.host}`);

    // Create a new MongoDBStore instance for session storage
    const MongoDBSessionStore = MongoDBStore(session);
    const store = new MongoDBSessionStore({
      uri: process.env.MONGO, // Use the same MongoDB URI as your database
      collection: "sessions", // Name of the collection to store sessions
      expires: 1000 * 60 * 60 * 24 * 7, // Session expiration (7 days)
    });
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit();
  }
};

export default connectDB;
