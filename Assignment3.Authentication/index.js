const http =require("http")
const server = http.createServer(async (req,res)=> {
    const body = await getBodyFromStream(req)
req.body = body
 if (req.url === "/books") {
    authenticate(req, res, getBooks);
  }
  if (req.url === "/authors") {
    authenticate(req, res, getAuthors);
  }const http = require("http");
  const { findUser } = require("./db.function");
  
  function getBodyFromStream(req) {
    return new Promise((resolve, reject) => {
      const data = [];
      req.on("data", (chunk) => {
        data.push(chunk);
      });
      req.on("end", () => {
        const body = Buffer.concat(data).toString();
        if (body) {
          // assuming that the body is a json object
          resolve(JSON.parse(body));
          return;
        }
        resolve({});
      });
  
      req.on("error", (err) => {
        reject(err);
      });
    });
  }
  
  function authenticate(req, res, next) {
    const { username, password } = req.body;
    console.log("authenticate", req.body);
    const user = findUser(username);
    if (!user) {
      res.statusCode = 401;
      res.end();
      return;
    }
    if (user.username !== username || user.password !== password) {
      res.statusCode = 401;
      res.end();
      return;
    }
    next(req, res);
  }
  
  function getBooks(req, res) {
    console.log("getBooks", req.body);
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ books: [{ name: "Harry Potter" }] }));
  }
  
  function getAuthors(req, res) {
    console.log("getBooks", req.body);
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ authors: [{ name: "J.K. Rowling" }] }))
   
  }
 function addBook (req, res) {
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
        })};
 function deleteBook (req, res) {
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

 function updateBook (req, res) {
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
    
  
  const server = http.createServer(async (req, res) => {
   
   
      const body = await getBodyFromStream(req);
      req.body = body;
      if (req.url === "/books") {
        authenticate(req, res, getBooks);
      }
      if (req.url === "/authors") {
        authenticate(req, res, getAuthors);}
      if (req.url === '/addBook') {
        authenticate(req, res, addBook)    
      }
      if (req.url === '/deleteBook') {
        authenticate(req, res, deleteBook)    
      }
      if (req.url === '/updateBook') {
        authenticate(req, res, updateBook)    
      }
    });
  
  server.listen(3000, () => {
    console.log("Server is listening on port 3000");
  });
  
})
