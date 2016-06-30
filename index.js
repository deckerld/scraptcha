'use strict'

var base64Img = require('base64-img');

// Stores live scrambled code for validation lookup.
var scraptchaImgLiveCode = [];  

// Default (starting) image code letters.
var scraptchaCode = ['M', 'D', '9', 'C', 'I', 'A', 'D',
                     'O', 'D', 'I', 'M', 'D', '9', 'C',
                     'I', 'C', '9', '3', '5', 'J', 'A',
                     '3', '4', 'D', 'F', 'G', 'H', 'F',
                     '8', 'V', '4', '9', '8', 'F', 'D',
                     '9', 'R', '8', 'F', 'C', 'C', 'M',
                     'V', 'N', '1', 'G', 'Y', 'B', '7',
                     '8', 'V', 'K', 'O', 'I', 'F', '2',
                     '9', 'S', 'D', '8', 'C', '8', '3',
                     'J', 'F', 'X', 'K', 'C', 'I', '3',
                     'M', 'V', 'J', 'F', '8', 'K', 'D',
                     'F', 'G', '8', 'V', 'M', 'K', 'C',
                     '9', 'S', 'K', 'L', 'D', '9'];

// Use for Code shuffling.
var scraptchaCodeOrder = [];

// Use to store the base64 converted images.
var scraptchaBase64Img = [];

var scraptcha = {
    /** ================================================================
     * initialize
     * 
     * Converts all code images to base64 and stores them in 'scraptchaBase64Img[]'.
     * 
     * @param img {array} : File path, prefix, and extension.
     * 
     * =================================================================
     */
    initialize: function(img){
        for(var x=1;x<=90;x++){
            scraptchaBase64Img.push(base64Img.base64Sync(img.path + img.filePrefix + x + img.fileExtension));
            scraptchaCodeOrder.push(x-1);
        }
    },

    /** ================================================================
     * getHTMLSnippet
     * 
     * Returns the HTML image code container.
     *
     * =================================================================
     */
    getHTMLSnippet: function(){
        var cnt = 5;
        var imgNumber = [];

        do {
            imgNumber.push(Math.floor(Math.random()*89) +1);
            cnt--;
        } while (cnt > 0)

        var date = new Date();

        var scraptchaId = (Math.floor(Math.random()*100) + 1) + date.getTime() + 
                          (Math.floor(Math.random()*100) + 1);

        var str = '<div id="'+ scraptchaId +'">' +
                  '<input name="scraptchaId" type="hidden" id="scraptchaId" value="'+ scraptchaId + '">'+
                  '<div class="scraptcha-code-table">' +
                  '<div class="scraptcha-code-row" id="scraptchaCodeRow">' + 
                  '<div class="scraptcha-code-cell" id="si01"><img src="'+ 
                  scraptchaBase64Img[imgNumber[0]] +'" /></div>'+
                  '<div class="scraptcha-code-cell" id="si02"><img src="'+ 
                  scraptchaBase64Img[imgNumber[1]] +'" /></div>'+
                  '<div class="scraptcha-code-cell" id="si03"><img src="'+ 
                  scraptchaBase64Img[imgNumber[2]] +'" /></div>'+
                  '<div class="scraptcha-code-cell" id="si04"><img src="'+ 
                  scraptchaBase64Img[imgNumber[3]] +'" /></div>'+
                  '<div class="scraptcha-code-cell" id="si05"><img src="'+ 
                  scraptchaBase64Img[imgNumber[4]] +'" /></div>'+                  
                  '</div></div></div>';

        var scraptchaImgLiveCodeLength = scraptchaImgLiveCode.length;

        if(scraptchaImgLiveCodeLength > 0){
            var tmpArray = [];

            for(var x=0;x<scraptchaImgLiveCodeLength;x++){    
                if(date.getTime() - scraptchaImgLiveCode[x][0] < 600000){
                    tmpArray.push(scraptchaImgLiveCode[x]);
                }
            }
            scraptchaImgLiveCode = tmpArray;
        }
        
        scraptchaImgLiveCode.push([date.getTime(), scraptchaId,  
                                scraptchaCode[imgNumber[0]] +
                                scraptchaCode[imgNumber[1]] +
                                scraptchaCode[imgNumber[2]] +
                                scraptchaCode[imgNumber[3]] +
                                scraptchaCode[imgNumber[4]]]);    
        scraptchaShuffle();

        return str;
    },
    /** ================================================================
     * verify
     * 
     * Returns validation status of the image code.
     * 
     * @param request {array} : Server request data.
     *
     * =================================================================
     */
    verify: function(request){
        
        var status;

        var codeString = request.params.data.split('|');    

        scraptchaImgLiveCode.forEach(function(item) {
            if(item[1] == codeString[0] && item[2] == codeString[1]){
                status = 'Valid';            
            } else {
                status = 'Invalid image verification code!  Please try again.';
            }
        });

        return status;
    }
}

/** ================================================================
 * scraptchaShuffle
 * 
 * The base64 images are shuffled after each request.
 * =================================================================
 */
function scraptchaShuffle(){
    var tmpCodeArray = new Array(90);
    var tmpImgArray = new Array(90);

    checkLength();
    
    function checkLength(){
        if(scraptchaBase64Img.length == 90){
            shuffle();
        } else {
            checkLength();
        }
    }

    function shuffle(){        
        scraptchaCodeOrder.sort(function(){return Math.random() - 0.5;});        

        for(var x=0;x < scraptchaCodeOrder.length;x++){ 
            tmpCodeArray[x] = scraptchaCode[scraptchaCodeOrder[x]];   
            tmpImgArray[x] = scraptchaBase64Img[scraptchaCodeOrder[x]];
        }

        scraptchaCode = tmpCodeArray;
        scraptchaBase64Img = tmpImgArray;
    }
}

module.exports = scraptcha;