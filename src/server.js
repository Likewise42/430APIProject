const http = require('http');
const url = require('url');
const query = require('querystring');

// handelers
const responseHandler = require('./responses.js');

// port
const port = process.env.PORT || process.env.NODE_PORT || 3000;


//put url stuff here




// start HTTP server
http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);