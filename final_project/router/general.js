const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6: Register new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (username && password) {
        if (!isValid(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "Customer successfully registered. Now you can login" });
        } else {
            return res.status(400).json({ message: "Customer already exists!" });
        }
    }
    return res.status(400).json({ message: "Unable to register customer." });
});

// Task 1: Get all books
public_users.get('/', function (req, res) {
    return res.status(200).send(JSON.stringify(books, null, 4));
});

// Task 2: Get book details by ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json(books[isbn]);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

// Task 3: Get book details by author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author.toLowerCase();
    const matches = [];
    for (const key in books) {
        if (books[key].author.toLowerCase() === author) {
            matches.push({ isbn: key, ...books[key] });
        }
    }
    if (matches.length > 0) {
        return res.status(200).json(matches);
    } else {
        return res.status(404).json({ message: "No books found by this author" });
    }
});

// Task 4: Get all books by title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title.toLowerCase();
    const matches = [];
    for (const key in books) {
        if (books[key].title.toLowerCase() === title) {
            matches.push({ isbn: key, ...books[key] });
        }
    }
    if (matches.length > 0) {
        return res.status(200).json(matches);
    } else {
        return res.status(404).json({ message: "No books found with this title" });
    }
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

/* ==========================================================
   Tasks 10-13: Async/Await & Promises with Axios
   ========================================================== */

// Task 10: Get all books using async/await with Axios
const getAllBooksAsync = async () => {
    try {
        const response = await axios.get('http://localhost:5000/');
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

// Task 11: Get book details by ISBN using Promises with Axios
const getBookByISBN = (isbn) => {
    axios.get(`http://localhost:5000/isbn/${isbn}`)
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.error(error);
        });
};

// Task 12: Get book details by Author using async/await with Axios
const getBooksByAuthor = async (author) => {
    try {
        const response = await axios.get(`http://localhost:5000/author/${encodeURIComponent(author)}`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

// Task 13: Get book details by Title using Promises with Axios
const getBooksByTitle = (title) => {
    axios.get(`http://localhost:5000/title/${encodeURIComponent(title)}`)
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.error(error);
        });
};

module.exports.general = public_users;
module.exports.getAllBooksAsync = getAllBooksAsync;
module.exports.getBookByISBN = getBookByISBN;
module.exports.getBooksByAuthor = getBooksByAuthor;
module.exports.getBooksByTitle = getBooksByTitle;
