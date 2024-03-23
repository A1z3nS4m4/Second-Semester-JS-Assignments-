const http = require('http');
const fs = require('fs')
const path = require('path');

let booksDB = [];
const booksDbPath = path.join(__dirname, "db", 'books.json');

const PORT = 4000
const HOST_NAME = 'localhost';

const requestHandler = function (req, res) {
    res.setHeader("Content-Type", "application/json");

    if (req.url === '/books' && req.method === 'GET') {
        getAllBooks(req, res);
        res.end('No books here')
    } else if (req.url === '/books' && req.method === 'POST') {
        addBook(req, res);
        res.end('No books here')
    } else if (req.url === '/books' && req.method === 'PUT') {
        updateBook(req, res);
        res.end('No books here')
    } else if (req.url.startsWith('/books') && req.method === 'DELETE') {
        deleteBook(req, res);
        res.end('No books here')
    } else if (req.url === '/books/authors' && req.method === 'GET') {
        res.end('Authors database unavailable')
    } else if (req.url === '/books/authors' && req.method === 'POST') {
        res.end('Authors database unavailable')
    } else if (req.url === '/books/authors' && req.method === 'PUT') {
        res.end('Authors database unavailable')
    } else {
        res.writeHead(404);
        res.end(JSON.stringify({
            message: 'Method Not Supported'
        }));
    }

}


const getAllBooks = function (req, res) {
    fs.readFile(booksDbPath, "utf8", (err, books)=> {
        if (err){
            console.log(err)
            res.writeHead(400)
            res.end("An error occured")
        }

        res.end(books);

    })
}


const addBook = function (req, res) {
    const body = [];

    req.on('data', (chunk) => {
        body.push(chunk);
    });

    req.on('end', () => {
        const parsedBody = Buffer.concat(body).toString();
        const newBook = JSON.parse(parsedBody); 

        
        const lastBook = booksDB[booksDB.length - 1];
        const lastBookId = lastBook.id;
        newBook.id = lastBookId + 1;


            res.end(JSON.stringify(newBook));
        });
    }



const updateBook = function (req, res) {
    const body = [];

    req.on('data', (chunk) => { 
        body.push(chunk); 
    });

    req.on('end', () => {
        const parsedBody = Buffer.concat(body).toString(); 
        const bookToUpdate = JSON.parse(parsedBody); 

        
        const bookIndex = booksDB.findIndex((book) => {
            return book.id === bookToUpdate.id;
        });

        
        if (bookIndex === -1) {
            res.writeHead(404);
            res.end(JSON.stringify({
                message: 'Book not found'
            }));
            return;
        }

        
    });
}



const deleteBook = function (req, res) {
    const bookId = req.url.split('/')[2];
    
    
    const bookIndex = booksDB.findIndex((book) => {
        return book.id === parseInt(bookId);
    })

    if (bookIndex === -1) {
        res.writeHead(404);
        res.end(JSON.stringify({
            message: 'Book not found'
        }));

        return;
    }

    booksDB.splice(bookIndex, 1); 

}

const server = http.createServer(requestHandler)

server.listen(PORT, HOST_NAME, () => {
    
    console.log(`Server is listening on ${HOST_NAME}:${PORT}`)
})