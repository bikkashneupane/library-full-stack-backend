import express from "express";

import cors from "cors";
import "dotenv/config";
import morgan from "morgan";

import { connectMongo } from "./src/db/config/mongoConfig.js";
import userRouter from "./src/router/userRouter.js";

const PORTNUM = process.env.PORT || 8000;

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/library/user", userRouter);

connectMongo();
app.listen(PORTNUM, (error) => {
  error
    ? console.log(error)
    : console.log(`Server started at http://localhost/${PORTNUM}`);
});
