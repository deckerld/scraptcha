# Scraptcha

<img align="right" height="260" src="http://www.darrendecker.com/images/icons/scraptchaNPMJS.svg">

Scraptcha provides a method of user validation for submission forms.

```js
var express = require('express');
var scraptcha = require('scraptcha');

 // Scraptcha images source information.   
var imageInformation = {path:          __dirname + "/images/green/",
                        filePrefix:    "i_cha_",
                        fileExtension: ".gif"};

// Initialize the Scraptcha data.
scraptcha.initialize(imageInformation);

// Static file server.
var server = new express();
server.use(express.static(__dirname));
server.listen(8800);
console.log("Server is listening on http://localhost:8800");

// Gets the scratcha code sequence. The "id" compensates for a browser update restriction. 
server.get('/scraptcha/:id', function (req, res) {
    res.send(scraptcha.getHTMLSnippet());
});

// Returns validation response.
server.get('/scraptchaValidate/:data', function (req, res) {
    res.send(scraptcha.verify(req));    
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

Reference files are located in the 'test' folder.  Start the example server by navigating to the ./node_modules/scraptcha directory
from the command prompt and perform the command "npm start" or "node ./test/file-server.js".

See the 'submit: function(){...}' in the 'main.js' file for end user form adaptation.

Use your own image base by creating a image cache and then edit 'imageInformation{...}' 
from the above example.  Update 'scraptchaCode[...]' in the package 'index.js' file if the
code sequence is different.

## License

  [MIT](LICENSE)