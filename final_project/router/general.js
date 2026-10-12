/**
 * @file general.js
 * @description Public routes for browsing books, user registration,
 * and asynchronous book retrieval functions using Axios and Async/Await.
 */

const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

/**
 * Task 6: Register a new user
 * @route POST /register
 */
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required for registration." });
    }
    if (isValid(username)) {
        return res.status(400).json({ message: "Customer already exists!" });
    }
    users.push({ username, password });
    return res.status(200).json({ message: "Customer successfully registered. Now you can login" });
});

/**
 * Task 1: Get the list of all books available in the shop
 * @route GET /
 */
public_users.get('/', async function (req, res) {
    try {
        const fetchBooks = () => new Promise((resolve) => resolve(books));
        const allBooks = await fetchBooks();
        return res.status(200).send(JSON.stringify(allBooks, null, 4));
    } catch (error) {
        return res.status(500).json({ message: "Failed to retrieve book catalogue: " + error.message });
    }
});

/**
 * Task 2: Get book details based on ISBN
 * @route GET /isbn/:isbn
 */
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    try {
        const fetchBookByISBN = () => new Promise((resolve, reject) => {
            if (books[isbn]) {
                resolve(books[isbn]);
            } else {
                reject(new Error(`Book with ISBN ${isbn} not found`));
            }
        });
        const book = await fetchBookByISBN();
        return res.status(200).json(book);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
});

/**
 * Task 3: Get book details based on Author
 * @route GET /author/:author
 */
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author.toLowerCase();
    try {
        const fetchByAuthor = () => new Promise((resolve, reject) => {
            const matches = [];
            for (const key in books) {
                if (books[key].author.toLowerCase() === author) {
                    matches.push({ isbn: key, ...books[key] });
                }
            }
            if (matches.length > 0) {
                resolve(matches);
            } else {
                reject(new Error(`No books found by author '${req.params.author}'`));
            }
        });
        const result = await fetchByAuthor();
        return res.status(200).json(result);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
});

/**
 * Task 4: Get book details based on Title
 * @route GET /title/:title
 */
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title.toLowerCase();
    try {
        const fetchByTitle = () => new Promise((resolve, reject) => {
            const matches = [];
            for (const key in books) {
                if (books[key].title.toLowerCase() === title) {
                    matches.push({ isbn: key, ...books[key] });
                }
            }
            if (matches.length > 0) {
                resolve(matches);
            } else {
                reject(new Error(`No books found with title '${req.params.title}'`));
            }
        });
        const result = await fetchByTitle();
        return res.status(200).json(result);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
});

/**
 * Task 5: Get book review based on ISBN
 * @route GET /review/:isbn
 */
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    } else {
        return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
    }
});

/* ==========================================================================
   Tasks 10-13: Async/Await implementations using Axios
   ========================================================================== */

/**
 * Task 10: Asynchronously get all books from the server using Axios with async/await.
 * @returns {Promise<Object>} Object containing all books in the store.
 */
const getAllBooksAsync = async () => {
    try {
        const response = await axios.get('http://localhost:5000/');
        return response.data;
    } catch (error) {
        console.error("Error retrieving all books via Axios:", error.message);
        throw error;
    }
};

/**
 * Task 11: Asynchronously get book details by ISBN from the server using Axios with async/await.
 * @param {string|number} isbn - The ISBN identifier of the book.
 * @returns {Promise<Object>} Object containing the book details.
 */
const getBookByISBN = async (isbn) => {
    try {
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
        return response.data;
    } catch (error) {
        console.error(`Error retrieving book with ISBN ${isbn} via Axios:`, error.message);
        throw error;
    }
};

/**
 * Task 12: Asynchronously get book details by Author from the server using Axios with async/await.
 * @param {string} author - The author name to query.
 * @returns {Promise<Array>} List of books matching the specified author.
 */
const getBooksByAuthor = async (author) => {
    try {
        const response = await axios.get(`http://localhost:5000/author/${encodeURIComponent(author)}`);
        return response.data;
    } catch (error) {
        console.error(`Error retrieving books by author '${author}' via Axios:`, error.message);
        throw error;
    }
};

/**
 * Task 13: Asynchronously get book details by Title from the server using Axios with async/await.
 * @param {string} title - The book title to query.
 * @returns {Promise<Array>} List of books matching the specified title.
 */
const getBooksByTitle = async (title) => {
    try {
        const response = await axios.get(`http://localhost:5000/title/${encodeURIComponent(title)}`);
        return response.data;
    } catch (error) {
        console.error(`Error retrieving books by title '${title}' via Axios:`, error.message);
        throw error;
    }
};

module.exports.general = public_users;
module.exports.getAllBooksAsync = getAllBooksAsync;
module.exports.getBookByISBN = getBookByISBN;
module.exports.getBooksByAuthor = getBooksByAuthor;
module.exports.getBooksByTitle = getBooksByTitle;
