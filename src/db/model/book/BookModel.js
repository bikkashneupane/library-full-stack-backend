import BookSchema from "./BookSchema.js";

//create new book
export const addNewBook = (bookObj) => {
  return BookSchema(bookObj).save();
};

//get all book for admin || public
export const getAllBooks = (filter) => {
  return BookSchema.find(filter);
};

//get book by id
export const getBookById = (_id) => {
  console.log(_id);
  return BookSchema.findById(_id);
};

//update book by id
export const editBook = (_id, updatedObj) => {
  return BookSchema.findByIdAndUpdate(_id, updatedObj);
};

//delete books by id(s)
export const deleteBookByIds = (_id) => {
  return BookSchema.findOneAndDelete(_id);
};

// //delete books by id(s)
// export const deleteBookByIds = (ids) => {
//   return BookSchema.deleteMany({ _id: { $in: ids } });
// };
