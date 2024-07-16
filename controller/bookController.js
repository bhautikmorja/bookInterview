const Book = require("../models/bookSchema");
const User = require("../models/userSchema");

const addBook = async (req, res) => {
  try {
    const bookData = { ...req.body, author: req.user._id };
    const createBook = await Book.create(bookData);
    res.status(201).json({ message: "Book Added", createBook });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate("author");
    if (!book) {
      throw new Error("Book not found");
    }
    res.status(200).json({ book });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addBook, getBook };
