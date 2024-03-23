const http = require('http');
const fs = require('fs')
const path = require('path');


let userDB = [];
const userDbPath = path.join(__dirname, "db",'users.json')
const PORT = 6000
const HOST_NAME = 'localhost';

function authenticateUser(req, res) {
    return new Promise((resolve, reject) => {
        const body = [];
  
        req.on('data', (chunk) => {
            body.push(chunk);
        });
  
        req.on('end', async () => {
            const parsedBody = Buffer.concat(body).toString();
            if (!parsedBody) {
                reject("Please enter your username and password");
            }
  
            const loginDetails = JSON.parse(parsedBody);
  
            const users = await getAllUsers();
            const userFound = users.find(user => user.username === loginDetails.username && user.password === loginDetails.password);
  
            if (!userFound) {
                reject("Username or password incorrect");
            }
  
            resolve(userFound)
  
        });
        if (!user){
            reject('User is undefined')
        }
      
    })
  }
  
  
function getAllUsers() {
    return new Promise((resolve, reject) => {
        fs.readFile(userDbPath, "utf8", (err, users) => {
            if (err){
                reject(err)
            }

            resolve(JSON.parse(users))
        })
    })
}

const requestHandler = function (req, res) {
    res.setHeader("Content-Type", "application/json");

    if (req.url === '/books' && req.method === 'GET'){
        authenticateUser(req, res)
        .then(()=> {
            getAllBooks(req, res);
        }).catch((err)=> {
            res.writeHead(401)
            res.end(JSON.stringify({
                message: 'No books to show you'
            }))
        })
      } else if (req.url === '/books' && req.method === 'POST') {       
        authenticateUser(req, res)
        .then(()=> {
            addBook(req, res);
        }).catch((err)=> {
            res.writeHead(401)
            res.end(JSON.stringify({
                message: 'No books to post'
            }))
        })
    } else if (req.url === '/books' && req.method === 'PUT') {
        authenticateUser(req, res)
        .then(()=> {
            updateBook(req, res);
        }).catch((err)=> {
            res.writeHead(401)
            res.end(JSON.stringify({
                message: 'No books to patch'
            }))
        })
    } else if (req.url.startsWith('/books') && req.method === 'DELETE') {       
        authenticateUser(req, res)
        .then(()=> {
            deleteBook(req, res);
        }).catch((err)=> {
            res.writeHead(401)
            res.end(JSON.stringify({
                message: 'No books to delete'
            }))
        })
    }else if (req.url === '/books/authors' && req.method === 'GET') {       
            authenticateUser(req, res)
            .then(()=> {
                addBook(req, res);
            }).catch((err)=> {
                res.writeHead(401)
                res.end(JSON.stringify({
                    message: 'Authors database unavailable'
                }))
            })    
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