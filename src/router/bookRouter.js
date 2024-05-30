import {
  addNewBook,
  editBook,
  getAllBooks,
  getBookById,
} from "../db/model/book/BookModel.js";
import { auth, isAdmin } from "../middlewares/auth.js";

import express from "express";
import { newBookValidation } from "../middlewares/joiValidation.js";

const bookRouter = express.Router();

//admin access
bookRouter.post(
  "/",
  auth,
  isAdmin,
  newBookValidation,
  async (req, res, next) => {
    try {
      const book = await addNewBook(req.body);
      book?._id
        ? res.json({
            status: "success",
            message: "New Book Added",
          })
        : res.json({
            status: "error",
            message: "Could not resolve request, try again",
          });
    } catch (error) {
      if (error.message.includes("E11000 duplicate key")) {
        error.message = "Another book with same ISBN already registered...";
        error.status = 200;
      }
      next(error);
    }
  }
);

//private controller - admin access sends all books both active and inactive
bookRouter.get("/all", async (req, res, next) => {
  try {
    const books = await getAllBooks();

    res.json({
      status: "success",
      books,
    });
  } catch (error) {
    next(error);
  }
});

//public controller - user access - sends only active books
bookRouter.get("/:_id?", async (req, res, next) => {
  try {
    const { _id } = req.params;

    const books = _id
      ? await getBookById(_id)
      : await getAllBooks({ status: "active" });

    res.json({
      status: "success",
      books,
    });
  } catch (error) {
    next(error);
  }
});

//edit book -------admin access
bookRouter.put("/", auth, isAdmin, async (req, res, next) => {
  try {
    const { _id, ...rest } = req.body;

    const editedBook = await editBook(_id, rest);
    editedBook?._id
      ? res.json({
          status: "success",
          message: "Book Edited",
        })
      : res.json({
          status: "error",
          message: "Book Edit Fail",
        });
  } catch (error) {
    next(error);
  }
});

bookRouter.delete("/", (req, res) => {});

export default bookRouter;
