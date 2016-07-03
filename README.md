# Scraptcha
Scraptcha provides a method of user validation for submission forms.

```js
var express = require('express');
var scraptcha = require('scraptcha');
var path = require('path');

var imageInformation = {path:          "./images/green/",
                        filePrefix:    "i_cha_",
                        fileExtension: ".gif"};

scraptcha.initialize(imageInformation);

var server = new express();
server.use(express.static('./'));
server.listen(8800);
console.log("Server is listening on http://localhost:8800");

// "id" compensates for a browser caching bug.
server.get('/scraptcha/:id', function (req, res) {
    res.send(scraptcha.getHTMLSnippet());
});

server.get('/scraptchaValidate/:data', function (req, res) {
    res.send(scraptcha.verify(req));
});

server.get('/', function (req, res) {    
    res.sendFile(path.join(__dirname + '/index.html'));
});
```

## Installation

```bash
$ npm install scraptcha
```

## Features

  * Image reference code entry
  * Base64 image conversion
  * Random code digit sizes
  * Image digit warp
  * Image order scrambling
  * Image code verification

## Quick Start

Reference files are located in the 'test' folder.  Setup a Express static server 
using the above example.  Start the server.

See the 'submit: function(){...}' in the 'main.js' file for end user form adaptation.

Use your own image base by creating a image cache and then edit 'imageInformation{...}' 
from the above example.  Update 'scraptchaCode[...]' in the package 'index.js' file if the
code sequence is different.

## License

  [MIT](LICENSE)