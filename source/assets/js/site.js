var Site = (function () {
  var runDetectizr = function () {
    window.Detectizr.detect({detectScreen:false});
  };

  var getActiveBlock = function () {

    var hash = window.location.hash;
    if(hash.length) {
      var hashCurrent = hash.replace(/#/,'');
      $('[' + hashCurrent + ']').addClass('active');
    }
  };

  return {
    runDetectizr: runDetectizr,
    getActiveBlock: getActiveBlock
  };

})();

Site.getActiveBlock();
Site.runDetectizr();
