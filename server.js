import authRouter from "./src/AuthRouter/authRouter.js";
import bookRouter from "./src/router/bookRouter.js";
import { connectMongo } from "./src/db/config/mongoConfig.js";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import userRouter from "./src/router/userRouter.js";

const PORT = process.env.PORT || 8000;

const app = express();
app.use(express.json());
app.use(cors());

connectMongo();

if (process.env.NODE_ENV !== "production") {
  //can be left in prod as well to track user requests
  app.use(morgan("dev"));
}

//Define main route handlers
app.use("/library/users", userRouter);
app.use("/library/authUser", authRouter);
app.use("/library/books", bookRouter);

//server status, should be before the 404 handler
app.get("/", (req, res, next) => {
  res.json("Server running Smoothly");
});

//404 Not Found Handler
//if path is not recognised by server
app.use((req, res, next) => {
  const error = new Error("404 Not Found");
  error.status = 404;
  next(error);
});

//Global error handler, must be last
app.use((error, req, res, next) => {
  console.log(error.status);

  res.status(error.status || 500).json({
    status: "error",
    message: error.message,
  });
});

app.listen(PORT, (error) => {
  error
    ? console.log(error)
    : console.log(`Server started at http://localhost/${PORT}`);
});
