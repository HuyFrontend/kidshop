/**
 *  @name accordion
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
  var pluginName = 'accordion',
      win = $(window),
      isShowAnimating = false,
      isHideAnimating = false,
      htmlBody = $('html, body');

  var initSlide = function(block){
    var thisEl = block.find('[data-slideshow-content]'),
        responsive = null;
        responsive = thisEl.find('.responsive');

      setArrowPos.call(this);

      responsive.slick({
        dots: false,
        infinite: true,
        speed: 300,
        arrows: false,
        slidesToShow: 3,
        slidesToScroll: 3,
        responsive: [
          {
            breakpoint: 640,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
        ]
      });

      thisEl
        .find('.slick-next')
        .off('click.' + pluginName)
        .on('click.' + pluginName, function(){
          responsive.slick('slickNext');
        });

      thisEl
        .find('.slick-prev')
        .off('click.' + pluginName)
        .on('click.' + pluginName, function(){
          responsive.slick('slickPrev');
        });
  };

  var setArrowPos = function() {
    setTimeout(function() {
      var buttonArrow = $('button.arrow'),
        slideImg = $('.active .img-wrap img');

      buttonArrow.css({
        top: ((slideImg.height() / 2) - (buttonArrow.height() / 2) + 5)
      });
    }, 100);
  };

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, options);
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var that = this,
          el = that.element,
          block1 = el.find(that.options.block1);

      that.vars = {
        block1: block1,
        textBTN: $(this.options.textBTN).data().button,
        textBTNAct: $(this.options.textBTNAct).data().buttonActive
      };
      $(that.vars.block1).find('.btn-1').html(that.vars.textBTN + '<i class="arrow"></i>');

      this.activeBlock = block1.filter('.active');

      if(this.activeBlock.length) {
        this.showDetail(this.activeBlock);
      }
      else {
        this.activeBlock = null;
      }

      block1.each(function(){
        var thisBlock = $(this),
            btn1 = thisBlock.find('.btn-1'),
            title = thisBlock.find('> .title > a');
        btn1
          .off('click.' + pluginName)
          .on('click.' + pluginName, function(){
            if(isHideAnimating || isShowAnimating) {
              return false;
            }
            if(thisBlock.hasClass('active')) {
              thisBlock.removeClass('active');
              that.hideDetail(thisBlock);
            }
            else {
              thisBlock.addClass('active');
              that.showDetail(thisBlock);
            }
          });
        title
          .off('click.' + pluginName)
          .on('click.' + pluginName, function(e) {
            e.preventDefault();
            btn1.trigger('click');
        });
      });

      win
        .off('resize.' + pluginName)
        .on('resize.' + pluginName, function() {
          setArrowPos.call(that);
          that.checkWidth();
      });

    },

    checkWidth: function() {
      var that = this;

      if(win.width() >= 640) {
        that.vars.block1.filter('.active').find('a.btn-1').css('float', 'left');
      }
      else{
        that.vars.block1.filter('.active').find('a.btn-1').css('float', 'right');
      }

    },

    showDetail: function(block) {
      var wrap = block.find('.wrap'),
        that = this,
        blockH = 0;

      if(this.activeBlock && this.activeBlock !== block) {
        this.hideDetail(this.activeBlock);
      }
      block.find('[data-hidden]').addClass('hidden');
      isShowAnimating = true;

      if(win.width() >= 640) {
        block.find('a.btn-1')
          .css('float', 'left')
          .html(that.vars.textBTNAct + '<i class="arrow"></i>');
      }

      wrap
        .removeClass('hidden')
        .css({
          height: '',
          width: ''
        });

      win.trigger('resize.' + pluginName);

      initSlide(block);

      blockH = wrap.height();

      wrap
        .css('height', 0)
        .animate({
          height: blockH
        }, 500, function() {
          isShowAnimating = false;
          block.addClass('active');
          that.activeBlock = block;
          wrap.css('height', '');
          setTimeout(function() {
            htmlBody.stop().animate({
              scrollTop: block.offset().top
            }, 300);
          }, 400);
      });
    },

    hideDetail: function(block) {
      var  that = this,
        shortDescription = block.find('[data-hidden]'),
        wrap = block.find('.wrap');

      isHideAnimating = true;

      wrap
        .animate({
          height: 0,
        }, 500, function() {
          isHideAnimating = false;
          block.removeClass('active');
          wrap.css('width', 'auto');
          block.find('a.btn-1')
            .css('float', 'right')
            .html(that.vars.textBTN + '<i class="arrow"></i>');
          that.activeBlock = null;
          shortDescription.removeClass('hidden');
          setTimeout(function() {
            htmlBody.stop().animate({
              scrollTop: block.offset().top
            }, 300);
          }, 400);
        });

      //destroy slick
      block.find('.responsive').slick('unslick');
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
    block1: '.block-1',
    wrap: '.wrap',
    textBTN: '[data-button]',
    textBTNAct: '[data-button-active]'
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));
