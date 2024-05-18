import BookSchema from "./BookSchema";

//create new book
export const addNewBook = (bookObj) => {
  return BookSchema(bookObj).save();
};

//get all book
export const getAllBooks = () => {
  return BookSchema.find();
};
