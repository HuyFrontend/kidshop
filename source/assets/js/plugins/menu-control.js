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

  var pluginName = 'menu-control',
      win = $(window);

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var that = this;

        that.isShowMenu = false;
        that.isShowSearch = false;
        that.timeout = null;
        that.vars = {};
        that.vars.mainMenu = $(that.options.mainMenu);
        that.vars.menu = $(that.options.menu);
        that.vars.search = $(that.options.search);
        that.vars.formSearch = $(that.options.formSearch);
        that.vars.inputSearch = that.vars.formSearch.find('input[type="text"]');
        that.vars.headerH = $(that.options.header).outerHeight();

        $('body')
          .off('click.' + pluginName)
          .on('click.' + pluginName, function(){
            if(that.isShowSearch){
              that.hideFormSearch();
            }
          });
        that.vars.formSearch
          .off('click.' + pluginName)
          .on('click.' + pluginName, function(e){
            e.stopPropagation();
          });

        that.vars.menu
          .off('click.' + pluginName)
          .on('click.' + pluginName, function(e){
            e.preventDefault();
            if(that.isRun) {
              return;
            }

            if(that.isShowSearch){
              that.vars.search.trigger('click');
            }          

            that[(that.isShowMenu) ? 'hideMenu' : 'showMenu']();

          });

        that.vars.search
          .off('click.' + pluginName)
          .on('click.' + pluginName, function(e) {
            e.preventDefault();
            if(that.isRun) {
              return;
            }

            if(that.isShowMenu){
              that.vars.menu.trigger('click');
            } 

            that[(that.isShowSearch) ? 'hideFormSearch' : 'showFormSearch']();

          });

        win
        .off('scroll.' + pluginName)
        .on('scroll.' + pluginName, function() {
          if(win.width() < win.height()){
            if(that.isShowMenu && win.width() <= 1024 && win.scrollTop() > win.height() - that.mainMenuH + that.liH*2) {
              that.hideMenu();
            }
          }else{
            if(that.isShowMenu && win.width() <= 1024 && win.scrollTop() - that.vars.headerH > that.mainMenuH - win.height() + that.liH*2) {
              that.hideMenu();
            }
          }
        })
        .trigger('resize');
    },

    showMenu: function() {
      var that = this;
      that.isRun = true;

      that.vars.menu.addClass('menu-active');
      that.vars.mainMenu.slideDown(function() {
        that.isRun = false;
        that.isShowMenu = true;
        that.mainMenuH = $(this).height();
        that.liH = that.vars.mainMenu.find(' > li').outerHeight();
      });
    },

    hideMenu: function() {
      var that = this;
      that.isRun = true;

      that.vars.menu.removeClass('menu-active');
      that.vars.mainMenu.slideUp(function() {
        that.isRun = false;
        that.isShowMenu = false;
      });
    },

    showFormSearch: function() {
      var that = this;

      that.isRun = true;
      that.vars.search.addClass('search-active');

      that.vars.formSearch.slideDown(300, function() {
        that.isRun = false;
        that.isShowSearch = true;
      });
    },

    hideFormSearch: function() {
      var that = this;

      that.isRun = true;
      that.vars.search.removeClass('search-active');
      that.vars.formSearch.slideUp(300, function() {
        that.isRun = false;
        that.isShowSearch = false;
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
    mainMenu: '.main-menu',
    header: 'header',
    menu: '.menu',
    search: '.search',
    formSearch: '.form-search',
    duration: 500
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
