import express from "express";

import cors from "cors";
import "dotenv/config";
import morgan from "morgan";

import { connectMongo } from "./src/db/config/mongoConfig.js";

const PORT = process.env.PORT || 8000;

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

connectMongo();
app.listen(PORT, (error) => {
  error
    ? console.log(error)
    : console.log(`Server started at http://localhost/${PORT}`);
});
