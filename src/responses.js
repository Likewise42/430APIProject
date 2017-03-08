// ryan muskopf http assignment 2
const fs = require('fs');
const crypto = require('crypto');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const style = fs.readFileSync(`${__dirname}/../client/style.css`);
const images = {};
let etag = crypto.createHash('sha1').update(JSON.stringify(images));
let digest = etag.digest('hex');

// ryan muskopf http assignment 2
// index and css
const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });

  response.write(index);

  response.end();
};
module.exports.getIndex = getIndex;

const getStyle = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });

  response.write(style);

  response.end();
};
module.exports.getStyle = getStyle;

// ryan muskopf http assignment 2
// responds
const respond = (request, response, status, content) => {
  const headers = {
    'Content-Type': 'application/json',
    etag: digest,
  };

  console.dir(content);

  response.writeHead(status, headers);
  response.write(JSON.stringify(content));
  response.end();
};

const respondMeta = (request, response, status) => {
  const headers = {
    'Content-Type': 'application/json',
    etag: digest,
  };

  response.writeHead(status, headers);
  response.end();
};

// ryan muskopf http assignment 2
// post
const upload = (request, response, body) => {
  const responseJSON = {
    message: 'need title, link, and author',
  };

  console.dir(body);

  if (!body.link || !body.title || !body.author) {
    responseJSON.id = 'missing params';
    return respond(request, response, 400, responseJSON);
  }

  let responseCode = 201;

  if (images[body.name]) {
    responseCode = 204;
  } else {
    images[body.name] = {};
  }

  images[body.name].name = body.name;
  images[body.name].age = body.age;

  etag = crypto.createHash('sha1').update(JSON.stringify(images));
  digest = etag.digest('hex');

  if (responseCode === 201) {
    responseJSON.message = 'Uploaded Image Data Successfully';
    return respond(request, response, responseCode, responseJSON);
  }

  return respondMeta(request, response, responseCode);
};
module.exports.upload = upload;

// ryan muskopf http assignment 2
// not head and 304
const notFound = (request, response, params, type) => {
  const responseJSON = {
    message: 'The page was not found',
    id: 'notFound',
  };
  respond(request, response, 404, responseJSON, type);
};
module.exports.notFound = notFound;


// 304 and head
