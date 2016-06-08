/**
 *  @name center-vertical
 *  @description description
 *  @version 1.0
 *  @options
 *    option
 *  @events
 *    event
 *  @methods
 *    init
 *    centerVertical
 *    destroy
 */
;(function($, window, undefined) {
  'use strict';

  var pluginName = 'center-vertical',
      win = $(window);


  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var that = this,
          opts = this.options;

      this.timeout = null;
      this.parentEl = this.element.closest(opts.parentSelector);
      this.controlEl = $(opts.controlSelector);

      win
        .on('resize.' + pluginName, function() {
          if(that.timeout) {
            clearTimeout(that.timeout);
          }
          that.timeout = setTimeout(function() {
            that.centerVertical();
          }, 50);
        })
        .trigger('resize.' + pluginName);
    },

    centerVertical: function() {
      var thisEl = this.element;
      if(win.width() >= 640) {
        thisEl.css({
          top: (this.controlEl.offset().top - this.parentEl.offset().top - thisEl.height()) / 2
        });
      }
      else {
        thisEl.css({
          padding: '',
          top: ''
        });
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
    parentSelector: '[data-center-vertical-parent]',
    controlSelector: '.controls ul'
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();

  });

}(jQuery, window));
