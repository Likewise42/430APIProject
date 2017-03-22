// ryan muskopf http assignment 2
const fs = require('fs');
const crypto = require('crypto');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const style = fs.readFileSync(`${__dirname}/../client/style.css`);
const images = {};
let etag = crypto.createHash('sha1').update(JSON.stringify(images));
let digest = etag.digest('hex');

const searchImages = (params) => {
  console.log('in searchImages');

  console.log('params.searchTerms:');
  console.dir(params);
  const paramsArray = params.searchTerms.split(' ');
  const returnJSON = {};
  returnJSON.images = {};

  const keysImages = Object.keys(images);
  const keysReturn = Object.keys(returnJSON);

  // fucking mess
  for (let i = 0; i < paramsArray.length; i++) {
    console.log(`i = ${i}`);
    for (let j = 0; j < keysImages.length; j++) {
      console.log(`j = ${j}`);
      const image = images[keysImages[j]];
      for (let k = 0; k < image.searchWordsArray.length; k++) {
        console.log(`k = ${k}`);
        console.log(`Are ${paramsArray[i]} and ${image.searchWordsArray[k]} the same?`);
        if (paramsArray[i] === image.searchWordsArray[k]) {
          let addJSON = true;

          for (let l = 0; l < keysReturn.length; l++) {
            console.log(`l = ${l}`);
            const rJSON = returnJSON[keysReturn[l]];
            if (image === rJSON) {
              addJSON = false;
            }
          }

          if (addJSON) {
            returnJSON.images[image.title] = image;
          }
        }
      }
    }
  }

  console.dir(returnJSON);

  return returnJSON;
};

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

  // console.dir(content);

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

  // console.dir(body);

  if (!body.link || !body.title || !body.author) {
    responseJSON.id = 'missing params';
    return respond(request, response, 400, responseJSON);
  }

  let responseCode = 201;

  if (images[body.title]) {
    responseCode = 204;
  } else {
    images[body.title] = {};
  }

  images[body.title].title = body.title;
  images[body.title].searchWords = body.title;

  images[body.title].link = body.link;

  images[body.title].author = body.author;
  images[body.title].searchWords += ` ${body.author}`;

  if (body.words) {
    images[body.title].words = body.words;
    images[body.title].searchWords += ` ${body.words}`;
  }

  images[body.title].searchWordsArray = images[body.title].searchWords.split(' ');

  // console.log(images[body.title].searchWordsArray);

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
// get
const getImages = (request, response, params) => {
  console.log('in getImages');
  let responseJSON = {};

  if (params.searchTerms === '') {
    responseJSON = {
      images,
    };
  } else {
    responseJSON = searchImages(params);
  }

  if (request.headers['if-none-match'] === digest) {
    return respondMeta(request, response, 304);
  }

  console.dir(responseJSON);

  return respond(request, response, 200, responseJSON);
};
module.exports.getImages = getImages;

const getImagesMeta = (request, response, params) => {
  console.log('in getImages');
  let responseJSON = {};

  if (params.searchTerms === '') {
    responseJSON = {
      images,
    };
  } else {
    responseJSON = searchImages(params);
  }

  if (request.headers['if-none-match'] === digest) {
    return respondMeta(request, response, 304);
  }

  console.dir(responseJSON);

  return respondMeta(request, response, 200);
};
module.exports.getImagesMeta = getImagesMeta;
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

const notFoundMeta = (request, response) => {
  respondMeta(request, response, 404);
};
module.exports.notFoundMeta = notFoundMeta;
// 304 and head
