'use strict';

/**
 * @ngdoc service
 * @name ngApp.metaUpdate
 * @license MIT
 * @copyright 2016 Chris Turnbull <https://github.com/christurnbull>
 * @description Update meta tags in the header of the page
 */
angular.module('ngApp')
  .factory('c_metaUpdate', function($window, $route, appCfg) {

    /**
     * Init
     */


    /**
     * Private
     */
    var defaultMeta = function() {
      return {
        title: appCfg.appName + ' - ' + $route.current.controller.replace('Ctrl', ''),
        description: appCfg.appName + ' - ' + $route.current.controller.replace('Ctrl', ''),
        url: $window.location.href,
        image: ''
      };
    };


    /**
     * Public
     */
    return defaultMeta;
  });
