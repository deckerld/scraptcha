var express = require('express');
var scraptcha = require('scraptcha');
var path = require('path');

 // Scraptcha images source information.   
var imageInformation = {path:          "./images/green/",
                        filePrefix:    "i_cha_",
                        fileExtension: ".gif"};

// Initialize the Scraptcha data.
scraptcha.initialize(imageInformation);

// Static file server.
var server = new express();
server.use(express.static('./'));
server.listen(8800);
console.log("Server is listening on http://localhost:8800");

// Gets the scratcha code sequence. "id" compensates for browser (to be discovered) cache update bug. 
server.get('/scraptcha/:id', function (req, res) {
    res.send(scraptcha.getHTMLSnippet());
});

// Returns validation response.
server.get('/scraptchaValidate/:data', function (req, res) {
    res.send(scraptcha.verify(req));    
});

// Default static server page.
server.get('/', function (req, res) {    
    res.sendFile(path.join(__dirname + '/index.html'));
});