const http = require('http');

const HOSTNAME = "localhost";
const PORT = 8900;


const server = http.createServer(requestHandler);
server.listen(PORT, HOSTNAME, () => {
  console.log(`Server started at http://$(HOSTNAME): $(PORT)`)
})

function requestHandler(req, res) {
  console.log(req);
  res.end("Hello From the server");
  res.write("Alabi Olamidotun");
  res.writehead(200);
}
