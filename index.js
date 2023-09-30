import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/connect.js";
import userRoute from "./routes/user.js";
import adminRoute from "./routes/admin.js"
import inboxRoute from "./routes/inbox.js"
import categoryRoute from "./routes/category.js"
import productRoute from "./routes/product.js"

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

app.use("/api/user", userRoute);
app.use("/api/admin", adminRoute)
app.use("/api/inbox", inboxRoute)
app.use("/api/category", categoryRoute)
app.use("/api/product", productRoute)

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