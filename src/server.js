 // ryan muskopf http assignment 2
const http = require('http');
const url = require('url');
const query = require('querystring');
// handelers
const responseHandler = require('./responses.js');
// port
const port = process.env.PORT || process.env.NODE_PORT || 3000;

// ryan muskopf http assignment 2
// put url stuff here
const onRequest = (request, response) => {
  // parse the url
  const parsedUrl = url.parse(request.url);
  const params = query.parse(parsedUrl.query);

  console.log(parsedUrl.pathname);
  console.dir(params);

	console.log(`method: ${request.method}`);
	
  if (request.method === 'GET') {
    if (parsedUrl.pathname === '/') {
      responseHandler.getIndex(request, response);
    } else if (parsedUrl.pathname === '/style.css') {
      responseHandler.getStyle(request, response);
    } else if (parsedUrl.pathname === '/getImages') {
      responseHandler.getImages(request, response, params);
    } else {
      responseHandler.notFound(request, response);
    }
  } else if (request.method === 'HEAD') {
    if (parsedUrl.pathname === '/getImages') {
     responseHandler.getImagesMeta(request, response,params);
    } else {
    responseHandler.notFoundMeta(request, response);
    }
  } else if (request.method === 'POST' && parsedUrl.pathname === '/upload') {
    const res = response;

    const body = [];

    request.on('error', () => {
      res.statusCode = 400;
      res.end();
    });


    request.on('data', (chunk) => {
      body.push(chunk);
    });

    request.on('end', () => {
      console.log(Buffer.concat(body).toString());

      const bodyString = Buffer.concat(body).toString();

      const bodyParams = query.parse(bodyString);

      responseHandler.upload(request, res, bodyParams);
    });
  } else {
    responseHandler.notFound(request, response);
  }
};

// ryan muskopf http assignment 2
// start HTTP server
http.createServer(onRequest).listen(port);
console.log(`Listening on 127.0.0.1: ${port}`);
