"use strict";
var Platform = {};

(function () {

  Platform.detectDevice = function () {
    var body = document.body;
    var ua = navigator.userAgent;
    var checker = {
      // OS
      Windows: ua.match(/Windows/),
      MacOS: ua.match(/Mac/),
      Android: ua.match(/Android/),

      // Browser
      Msie: ua.match(/Trident/),
      Edge: ua.match(/Edge/),
      Chrome: ua.match(/Chrome/),
      Firefox: ua.match(/Firefox/),
      Safari: ua.match(/Safari/),

      // Device
      isApple: ua.match(/(iPhone|iPod|iPad)/),
      iPhone: ua.match(/iPhone/),
      iPad: ua.match(/iPad/),
      iPod: ua.match(/iPod/),
    };

    if (checker.isApple) {
      // Apple
      body.classList.add('isApple');

      if (checker.iPhone) {
        // Apple iPhone
        body.classList.add('iphone');
      } else if (checker.iPad) {
        // Apple iPad
        body.classList.add('ipad');
      } else if (checker.iPod) {
        // Apple iPod
        body.classList.add('ipod');
      }

    } else  if (checker.Windows){
      // Windows OS
      body.classList.add('windowsOS');

      if (checker.Edge){
        // Edge Browser
        body.classList.add('edge');
      } else if (checker.Chrome){
        // Chrome Browser
        body.classList.add('chrome');
      } else if(checker.Safari){
        // Safari Browser
        body.classList.add('safari');
      } else if(checker.Firefox){
        // Firefox Browser
        body.classList.add('firefox');
      } else if(checker.Msie){
        // IE Browser
        body.classList.add('msie');
      }

    } else if (checker.MacOS){
      // Mac OS
      body.classList.add('macOS');

      if (checker.Chrome){
        // Chrome Browser
        body.classList.add('chrome');
      } else if(checker.Safari){
        // Safari Browser
        body.classList.add('safari');
      } else if(checker.Firefox){
        // Firefox Browser
        body.classList.add('firefox');
      }

    } else if (checker.Android){
      // Android OS
      body.classList.add('AndroidOS');
    }

  }

  Platform.detectDevice();

})($);
