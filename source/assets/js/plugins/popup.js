/**
 *  @name plugin
 *  @description description
 *  @version 1.0
 *  @options
 *    option
 *  @events
 *    event
 *  @methods
 *    init
 *    publicMethod
 *    destroy
 */
;(function($, window, undefined) {
  'use strict';

  var pluginName = 'show-popup';
  var html = $('html'),
    win = $(window);

  function preloadImage($images, callback){
    var numberImage = $images.length || 0;

    if(numberImage){
      $images.each(function(idx){
        var newImage = new Image();

        newImage.onload = function(){
          if(idx === numberImage - 1){
            callback();
          }
        };
        newImage.src = $(this).attr('src');
      });
    }
    else{
      callback();
    }
  }

  function throttle(fn, threshhold, scope) {
    threshhold || (threshhold = 250);
    var last,
        deferTimer;
    return function () {
      var context = scope || this;

      var now = +new Date(),
          args = arguments;
      if (last && now < last + threshhold) {
        // hold on to it
        clearTimeout(deferTimer);
        deferTimer = setTimeout(function () {
          last = now;
          fn.apply(context, args);
        }, threshhold);
      } else {
        last = now;
        fn.apply(context, args);
      }
    };
  }

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var that = this,
        el = that.element,
        popup = $(that.options.popup),
        overlay = $(that.options.overlay),
        btnClose = popup.find(that.options.btnClose);
          
      that.vars = {
        popup: popup,
        overlay: overlay
      }; 

      el
        .off('click.' + pluginName)
        .on('click.' + pluginName, function(e) {
          e.preventDefault();
          that.showPopup(e.currentTarget);
        });

      btnClose
        .off('click.' + pluginName)
        .on('click.' + pluginName, function(e) {
          e.preventDefault();
          that.closePopup();
        });

      popup
        .off('click.' + pluginName)
        .on('click.' + pluginName, function(e) {
          var $target = $(e.target);
          while($target.length && !$target.hasClass('inner')) {
            $target = $target.parent();
          }

          if (!$target.length) {
            btnClose.trigger('click.' + pluginName);
          }
        });

      win
        .off('resize.' + pluginName)
        .on('resize.' + pluginName, throttle(that.resize, 250, that));
    },

    showPopup:function(el) {
      var $el = $(el),
        that = this,
        popup = that.vars.popup,
        videoSrc = $el.data('videoSrc'),
        imgSrc = $el.data('imgSrc');      

      html.addClass('showPopup');
      if(videoSrc){
        popup
          .find('.inner')
          .append(
            '<div class="video-wrapper">' +
            '<iframe class="media" width="' + this.options.widthVideo + '" height="' + this.options.heightVideo + '" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'+
            '</div>'
          ) 
          .find('iframe')
          .attr('src', videoSrc);
      }
      else if(imgSrc) {
        popup
          .find('.inner')
          .append('<img class="media" src="images/transparent.png" alt="" />')
          .find('img')
          .attr('src', imgSrc);
      }


      preloadImage(popup.find('img'), function () {
        popup.add(that.vars.overlay).show();
        that.resize();
      });
      
    },

    closePopup: function() {
      var that = this;
      html.removeClass('showPopup');
      that.vars.popup
        .find('.inner')
        .removeClass('active')
        .children(':not(a)')
        .remove();
      that.vars.popup.add(that.vars.overlay).hide(); 
    },

    resize: function() {
      var that = this,
        winWidth =  win.width(),
        winHeight = win.height(),
        inner = that.vars.popup.find('.inner'),
        videoWrapper = inner.find('.video-wrapper'),
        iframe = videoWrapper.find('iframe'),
        width = +iframe.attr('width'),
        height = +iframe.attr('height'),
        aspectRatio;

        inner.css('max-height', win.height() - 30);

        that.vars.popup
          .find('.media')
          .css('max-height', winHeight - 40);

        if (width && winWidth < (width + 40)) {
          aspectRatio = height/width;
          inner.addClass('active');
          videoWrapper.css('padding-top', (aspectRatio * 100) + '%');
        }
        else {
          inner.removeClass('active');
          videoWrapper.css('padding-top', '');
          return;
        }
    },

    destroy: function() {
      $.removeData(this.element[0], pluginName);
    }
  };

  $.fn[pluginName] = function(options, params) {
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (!instance) {
        $.data(this, pluginName, new Plugin(this, options));
      } else if (instance[options]) {
        instance[options](params);
      } else {
        window.console && console.log(options ? options + ' method is not exists in ' + pluginName : pluginName + ' plugin has been initialized');
      }
    });
  };

  $.fn[pluginName].defaults = {
    popup: '#popup',
    overlay: '.overlay',
    btnClose: '.icon-close',
    widthVideo: 600,
    heightVideo: 400
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });
}(jQuery, window));
