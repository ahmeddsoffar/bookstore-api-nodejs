const express = require("express");
//create express router
const router = express.Router();
const {
  getAllBooks,
  getSingleBook,
  addBook,
  updateBook,
  deleteBook,
} = require("../controller/book-conteoller");

router.get("/get-books", getAllBooks);
router.get("/get-book/:id", getSingleBook);
router.post("/create-book", addBook);
router.put("/update-book/:id", updateBook);
router.delete("/delete-book/:id", deleteBook);

module.exports = router;
