(function(window, document) {

  window.onload = function() {
    var inactiveElements = document.querySelectorAll('.inactive');

    Array.prototype.forEach.call(inactiveElements, function(elem) { 
      elem.classList.remove('inactive');
    });
  }

})(window, document);
