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

  var pluginName = 'plugin';
  var privateVar = null;
  var privateMethod = function() {
    // to do
  };

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var that = this;
      this.vars = {
        key: 'value'
      };
      // initialize
      // add events
    },
    publicMethod: function(params) {
      // to do
      $.isFunction(this.options.onCallback) && this.options.onCallback();
      this.element.trigger('customEvent');
    },
    destroy: function() {
      // remove events
      // deinitialize
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
    key: 'value',
    onCallback: null
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]({
      key: 'custom'
    });
    $('[data-' + pluginName + ']').on('customEvent', function(){
      // to do
    });
  });

}(jQuery, window));
