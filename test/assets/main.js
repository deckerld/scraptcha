
window.onload = function(){  
  scraptcha.init();
}
  
var scraptcha = {
  
  init: function(){
    this.load();  
    this.draw();
    document.getElementById('scraptchaContainer').style.visibility = "visible";
  },

  draw: function(){
    var eFC = document.getElementById('formContainer');
    var eSC = document.getElementById('scraptchaCodeRow');  
    var eFCPadding = window.getComputedStyle(eFC).getPropertyValue('padding');
    var alignLeft = (eFC.clientWidth/2 - eSC.clientWidth/2) - eFCPadding.slice(0,eFCPadding.length-2)/2;
    document.getElementById('scraptchaContainer').style.left = alignLeft + "px";
  },

  updateDivContents: function(url, str){
    var xmlHttp = null;  
    xmlHttp = new XMLHttpRequest();                         
    xmlHttp.onreadystatechange = popData;
    xmlHttp.open("GET", url, true);                                                   
    xmlHttp.send();  
    
    function popData()
    {
      if( xmlHttp.readyState == 4 && xmlHttp.status == 200){
        var content = xmlHttp.responseText;      
        var div = document.getElementById(str);      
        div.innerHTML = content;      
        scraptcha.draw();
      }
    }    
  },

  load: function(){

    var cnt = 10;

    if(cnt > 0) load();

    function load(){
      if(document.getElementById("si01") != undefined){      
        getScraptchaImages();
        initButtons();
      } else {
        cnt--;
        setTimeout(function(){load()},500);      
      }
    }

    function getScraptchaImages(){    
      scraptcha.updateDivContents("/scraptcha/" + Math.floor((Math.random()*100) + 1), "scraptchaContainer");    
    }

    function initButtons(){
      var button1 = document.getElementById("scraptchaSubmit");      
      var button2 = document.getElementById("scraptchaRefresh");
      button1.onclick = function () {
        scraptcha.submit();
        return false;
      }
      button2.onclick = function () {      
        scraptcha.updateDivContents("/scraptcha/" + Math.floor((Math.random()*100) + 1), "scraptchaContainer");      
        return false;
      }    
    }
  },

  submit: function(){    
      var element = document.getElementById("scraptchaReply");
      element.innerHTML = '';

      scraptcha.updateDivContents("/scraptchaValidate/" + document.getElementById('scraptchaId').value +
                                  "|" + document.getElementById('scraptchaCode').value, "scraptchaReply");
              
      setTimeout(function(){check();},200);

      var cnt = 0;

      function check(){
        if(element.innerHTML == '' && cnt < 30){
          cnt++;        
          setTimeout(function(){check();},200);
        } else {          
          if(element.innerHTML == "Valid"){          
            var str = '<div class="scraptcha-submit-reply">Message Submitted</div><div class="scraptcha-spacer-4"></div>';
            document.getElementById('scraptchaContainer').style.left = '0px';
            document.getElementById('scraptchaContainer').innerHTML = str;
          }
        }
      }
  }
}