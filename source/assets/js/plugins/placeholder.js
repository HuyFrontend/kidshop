/**
 *  @name placeholder
 *  @description fix bug placeholder on IE9 only
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

  var pluginName = 'placeholder',

  keyDownHandler = function() {
    if(this.canDisplay) {
      this.element.val('');
      this.canDisplay = false;
    }
  },

  keyUpHandler = function() {
    var thisEl = this.element,
        domEl = thisEl[0];
    if(!this.canDisplay && !thisEl.val()) {
      thisEl.val(this.placeholder);
      domEl.selectionStart = 0;
      domEl.selectionEnd = 0;
      this.canDisplay = true;
    }
  },

  focusinHandler = function() {
    var domEl = this.element[0];
    if(this.canDisplay) {
      this.element.val(this.placeholder);
      domEl.selectionStart = 0;
      domEl.selectionEnd = 0;
    }
  },

  focusoutHandler = function() {
    if(this.canDisplay) {
      this.element.val(this.placeholder);
    }
  };


  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var thisEl = this.element,
          that = this;

      that.placeholder = thisEl.attr('placeholder');
      that.canDisplay = true;
      thisEl
        .val(that.placeholder)
        .off('focusout.' + pluginName)
        .on('focusout.' + pluginName, function() {
          focusoutHandler.call(that);
        })
        .off('focusin.' + pluginName + ' click.' + pluginName)
        .on('focusin.' + pluginName  + ' click.' + pluginName, function() {
          focusinHandler.call(that);
        })
        .off('keydown.' + pluginName)
        .on('keydown.' + pluginName, function() {
          keyDownHandler.call(that);
        })
        .off('keyup.' + pluginName)
        .on('keyup.' + pluginName, function() {
          keyUpHandler.call(that);
        });
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
  };

  $(function() {
    if($('html').hasClass('ie9')) {
      $('[data-' + pluginName + ']')[pluginName]();
    }

  });

}(jQuery, window));
