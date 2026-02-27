require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRouter = require("./routes/auth");
const postRouter = require("./routes/posts");
const commentRouter = require("./routes/comments")
const usersRouter = require("./routes/users")

const app = express();
app.use(express.json());

const DB_URL = process.env.DB_URL;
const PORT = process.env.PORT;

mongoose.connect(DB_URL)
.then(() => console.log("MongoDB connected successfully!"))
.catch((err) => console.log("MongoDB error", err))

app.use(cors({
    origin : ["https://frontendadminblogapp.netlify.app", "https://frontendpublicblogapp.netlify.app",  "http://localhost:5174"],
    methods : ["GET", "POST", "PUT", "DELETE"],
    credentials : true
}));

app.use("/api/users", usersRouter)
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/comments", commentRouter);


app.listen(PORT, () => {
    console.log(`Server is running in the port : ${PORT} `)
})