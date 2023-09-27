import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/connect.js";
import userRoute from "./routes/user.js"

dotenv.config()
const PORT = process.env.PORT || 5500

const app = express();
app.use(express.json());
app.use(cors())
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

app.get("/", (req, res) => {
    res.send("API is running...");
});

app.use("/api/users", userRoute)

// error handler
app.use(function (err, req, res, next) {
    console.log(err)
    res.status(err.status || 500).send({
        success: false,
        message: err.message,
    });
});
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(
                `Server is running in ${process.env.NODE_ENV} on port ${PORT}!!!`
            );
        });
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });