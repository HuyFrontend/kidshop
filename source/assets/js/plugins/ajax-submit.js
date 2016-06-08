/**
 *  @name ajax-submit
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

  var pluginName = 'ajax-submit',

  createSubmitData = function() {
    var submitData = {},
        i = 0, len = 0,
        inputItems = this.inputItems,
        inputItem = null;

    for(i = 0, len = inputItems.length; i < len; i++) {
      inputItem = inputItems.eq(i);
      if($.trim(inputItem.attr('type')).toLowerCase() === 'checkbox') {
        submitData[inputItem.attr('name')] = [];
        $('[name="' + inputItem.attr('name') + '"]:checked').each(function(index, value) {
          submitData.push(value);
        });
      }
      else {
        submitData[inputItem.attr('name')] = inputItem.val();
      }
    }

    return submitData;
  },

  addError = function(errorMsg) {
    var formGroup = this.element.find('.form-group');
    if (this.errorEl) { this.errorEl.remove(); }
    this.errorEl = $('<span class="error-status">error status</span>')
      .appendTo(formGroup)
      .html(errorMsg);
  }, 

  removeError = function() {
    if(this.errorEl) {
      this.errorEl
        .animate({ opacity: 0 }, 200, function () {
          $(this).remove();
        });
    }
  },

  addSuccess = function(successMsg) {
    var formGroup = this.element.find('.form-group');
    if (this.successEl) { this.successEl.remove(); }
    this.successEl = $('<span class="success-status">success status</span>')
      .appendTo(formGroup)
      .html(successMsg);
  },

  removeSuccess = function() {
    if(this.successEl) {
      this.successEl
        .animate({ opacity: 0 }, 200, function () {
          $(this).remove();
        });
    }
  },

  submitAjax = function() {
    var that = this;
    this.loadingPanel.removeClass('hidden');

    $.ajax({
      dataType: 'JSON',
      type: this.submitMethod,
      url: this.submitUrl,
      data: createSubmitData.call(this),
      timeout: 15000
    })
    .fail(function(jqXHR) {
      that.loadingPanel.addClass('hidden');
      removeSuccess.call(that);
      addError.call(that, jqXHR.statusText);
      that.hideErrorTimeout = setTimeout(function() {
        removeError.call(that);
      }, 5000);
    })
    .done(function(data) {
      if(data.status) {
        removeError.call(that);
        addSuccess.call(that, data.msg);
        that.hideSuccessTimeout = setTimeout(function() {
          removeSuccess.call(that);
        }, 5000);
      }
      else {
        removeSuccess.call(that);
        addError.call(that, data.msg);
        that.hideErrorTimeout = setTimeout(function() {
          removeError.call(that);
        }, 5000);
      }
      that.loadingPanel.addClass('hidden');
    });
  },

  formSubmitHandler = function() {
    submitAjax.call(this);
  };


  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var that = this,
          thisEl = this.element;

      that.inputItems = thisEl.find('input, select, textarea')
                          .not('input[type="submit"], input[type="reset"]');
      that.submitMethod = thisEl.attr('method');
      that.submitUrl = thisEl.attr('action');
      that.loadingPanel = $(thisEl.data('loading'));

      if(thisEl.filter('[data-validate]').length) {
        thisEl
          .on('validateSuccess.' + pluginName, function() {
            formSubmitHandler.call(that);
          })
          .on('validateError', function () {
            removeSuccess.call(that);
          })
          .on('submit.' + pluginName, function() {
            return false;
          });
      }
      else {
        thisEl
          .off('submit.' + pluginName)
          .on('submit.' + pluginName, function() {
            formSubmitHandler.call(that);
            return false;
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
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();

  });

}(jQuery, window));
