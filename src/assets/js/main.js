"use strict";

document.addEventListener('DOMContentLoaded', () => {
  console.log("DOMContentLoaded");
  $('body').autoPadding({
    source: $('.js-header'),
  });
  var myModalEl = document.getElementById('exampleModal')
  myModalEl.addEventListener('hidden.bs.modal', function (event) {
    console.log('close modal no jquery');
  })
})
