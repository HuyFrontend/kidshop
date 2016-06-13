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
  var pluginName = 'slider',
      win = $(window);

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, options);
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var that = this,
          opts = that.options,
          preview = that.element.find(opts.preview),
          sliderControl = that.element.find(opts.sliderControl),
          scrollAble = that.element.closest(opts.scrollEl),
          canSlide = false,
          preScroll = 0;

      var eventStart = 'touchstart',
          eventMove = 'touchmove',
          eventEnd = 'touchend';

      var distanceMoveY = 0,
          distanceMove = 0,
          posStart, posEnd, posStartY, posEndY;

      that.vars = {};
      that.vars.forceWait = false;
      that.vars.activeIndex = opts.active;
      that.vars.sliderControlItem = sliderControl.find('li');
      that.vars.slider = preview.find('> ul');
      that.vars.sliderItem = that.vars.slider.find('> li');
      that.vars.numberItem = that.vars.sliderItem.length;
      // that.vars.itemWidth = win.width();
      that.vars.sliderControlItem.eq(that.vars.activeIndex).addClass('active');
      that.vars.sliderPos = parseInt(that.vars.slider.css('margin-left'));
      that.vars.sliderItem.css('width', that.vars.itemWidth);
      that.vars.previewHeight = preview.outerHeight();
      that.vars.preview = preview;
      that.vars.imgEl = preview.find('ul.slides li img').first();
      that.timeout = null;

      that.vars.sliderItem.eq(0).css('zIndex', 1);

      // that.autoPlay();

      preview[0].addEventListener(eventStart, function(e){
        if(!that.vars.forceWait){
          posStart = posEnd = e.pageX || e.targetTouches[0].pageX;
          posStartY = posEndY = e.pageY || e.targetTouches[0].pageY;
        }
        preScroll = scrollAble.scrollTop();
      }, false);

      preview[0].addEventListener(eventMove, function(e){

        if(!that.vars.forceWait){
          posEnd = e.pageX || e.targetTouches[0].pageX;
          posEndY = e.pageY || e.targetTouches[0].pageY;

          distanceMove = posEnd - posStart;
          distanceMoveY = posEndY - posStartY;
          canSlide = Math.abs(distanceMoveY) < Math.abs(distanceMove);


          if(canSlide){
            e.preventDefault();
            that.vars.slider.css('margin-left', that.vars.sliderPos + distanceMove);
          } else {
            scrollAble.scrollTop(preScroll - distanceMoveY);
          }
        }
      }, false);

      preview[0].addEventListener(eventEnd, function(){
        if(posStart > posEnd){
          if(that.vars.activeIndex !== (that.vars.numberItem - 1)){
            that.slideTo(that.vars.activeIndex + 1);
          }
          else{
            that.slideTo(that.vars.numberItem - 1);
          }
        }
        else if(posStart < posEnd){
          if(that.vars.activeIndex !== 0){
            that.slideTo(that.vars.activeIndex - 1);
          }
          else{
            that.slideTo(0);
          }
        }
      }, false);

      sliderControl.off('click.' + pluginName).on('click.' + pluginName, 'a', function(e){
        e.preventDefault();
        that.slideTo($(this).parent().index());
      });

      win
        .on('resize.' + pluginName, function(){
          if(that.timeout) {
            clearTimeout(that.timeout);
          }
          that.timeout = setTimeout(function() {
            if(that.element.is(':visible')){
              that.resizeSlide();
            }
          }, 50);
        })
        .trigger('resize');

      that.vars.imgEl[0].onload = function() {
        win.trigger('resize');
      };
    },
    slideTo: function(index){
      var that = this,
          preview = that.vars.preview,
          activeItem = that.vars.sliderItem.eq(index),
          step = (index + that.vars.numberItem) % that.vars.numberItem;

      if (index >= that.vars.numberItem) {
        index = 0;
      }
      that.vars.forceWait = true;
      if(that.vars.forceWait){
        that.vars.sliderControlItem.removeClass('active');
        that.vars.sliderControlItem.eq(index).addClass('active');
        that.vars.slider.animate({
          'margin-left': - step * preview.width()
        }, that.options.duration, 'linear', function(){
          that.vars.activeIndex = index;
          that.vars.forceWait = false;
          that.vars.sliderItem.not(activeItem).css('zIndex', '');
          that.vars.sliderItem.eq(index).css('zIndex', 1);
          that.vars.sliderPos = parseInt(that.vars.slider.css('margin-left'));
        });
      }
    },

    autoPlay: function(){
      var that = this;
      if(!that.vars.forWait){
        setInterval(function(){
          that.slideTo(that.vars.activeIndex + 1);
        }, 5000);
      }
    },

    resizeSlide: function(){
      var that = this,
          preview = that.vars.preview,
          pWth = 0;

      preview.css('margin', '');
      pWth = preview.width();
      that.vars.sliderItem.css('width', pWth);
      that.vars.slider.css('margin-left', - (that.vars.activeIndex * pWth));
      $('[data-center-vertical]').each(function() {
        $(this).data('center-vertical').centerVertical();
      });
      setTimeout(function() {
        $('[data-center-vertical]').each(function() {
          $(this).data('center-vertical').centerVertical();
        });
      }, 200);

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
    scrollEl: '.inner',
    preview: '.preview',
    sliderControl: '.controls',
    duration: 400,
    active: 0
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));
