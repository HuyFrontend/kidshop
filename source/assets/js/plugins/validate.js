/**
 *  @name validate
 *  @description description
 *  @version 1.0
 *  @options
 *    option
 *  @events
 *    event
 *  @methods
 *    init
 *    validateFrm
      validateInput
 *    destroy
 */
;(function($, window, undefined) {
  'use strict';

  var pluginName = 'validate',
      L10N = window.L10N,
      emailRegEx = /^[^\W\_]([a-zA-Z0-9]|([\.\-\_](?![\.\-\_]))(?!\@))*@([^\W\-\_\.]([a-zA-Z0-9]|([\.\-\_](?![\.\-\_]))(?!\@))*\.)+[^\W\_\.]{2,4}$/,

  addError = function(inputItem, errClass, errorMsg) {
    var formGroup = this.element.find('.form-group');
    inputItem
      .addClass('error')
      .addClass(errClass);

    if (this.errorEl) { this.errorEl.remove(); }
    this.errorEl = $('<span class="error-txt">error message</span>')
      .appendTo(formGroup)
      .html(errorMsg);
  },

  removeError = function(inputItem, errClass) {
    inputItem
      .removeClass('error')
      .removeClass(errClass);
    if(this.errorEl) {
      this.errorEl
      .animate({ opacity: 0 }, 200, function () {
        $(this).remove();
      });
    }
  },

  validateFunc = function() {
    var that = this;

    return {
      '[required]': function(inputItem) {
        var inputVal = inputItem.val();
        if(!inputVal || inputVal === inputItem.attr('placeholder')) {
          addError.call(that, inputItem, 'err-required', L10N.Error.required);
          return false;
        }
        else {
          removeError.call(that, inputItem, 'err-required');
          return true;
        }
      },
      '[data-email]': function(inputItem) {
        if(!emailRegEx.test(inputItem.val())) {
          addError.call(that, inputItem, 'err-email', L10N.Error.email);
          return false;
        }
        else {
          removeError.call(that, inputItem, 'err-email');
          return true;
        }
      }
    };
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

      this.inputItems = thisEl.find('input, select, textarea');
      thisEl.attr('novalidate', '');

      thisEl
        .off('submit.' + pluginName)
        .on('submit.' + pluginName, function() {
          return that.validateFrm();
        });

    },

    validateFrm: function() {
      var i = 0, len = 0,
          inputItem = null;

      for(i = 0, len = this.inputItems.length; i < len; i++) {
        inputItem = this.inputItems.eq(i);
        if(!this.validateInput(inputItem)) {
          inputItem.focus();
          this.element.trigger('validateError');
          return false;
        }
      }
      this.element.trigger('validateSuccess');
      return true;
    },

    validateInput: function(inputItem) {
      var _validateFunc = validateFunc.call(this),
          i = '';

      for(i in _validateFunc) {
        if(inputItem.filter(i).length && !_validateFunc[i](inputItem)) {
          return false;
        }
      }
      return true;
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
    $('[data-' + pluginName + ']')[pluginName]();

  });

}(jQuery, window));
