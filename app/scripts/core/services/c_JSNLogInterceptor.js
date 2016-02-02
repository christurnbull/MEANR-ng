'use strict';

/**
 * @ngdoc service
 * @name ngApp.jsnlogInterceptor
 * @license MIT
 * @copyright 2016 Chris Turnbull <https://github.com/christurnbull>
 * @description
 * Intercept ajax to log slow requests using jsnlog
 */
angular.module('ngApp')
  .factory('c_JSNLogInterceptor', function($q) {

    /*
     * Log to the server when ajax requests are slow or timeout
     */

    return {
      request: function(config) {
        config.msBeforeAjaxCall = new Date().getTime();
        config.warningAfter = 3000; // milliseconds
        return config;
      },
      response: function(response) {
        // check for slowness
        if (response.config.warningAfter) {
          var msAfterAjaxCall = new Date().getTime();
          var timeTakenInMs = msAfterAjaxCall - response.config.msBeforeAjaxCall;
          if (timeTakenInMs > response.config.warningAfter) {
            JL('Angular.Ajax').warn({
              'timeTakenInMs': timeTakenInMs,
              config: response.config,
              data: response.data
            });
          }
        }
        return response;
      },
      responseError: function(rejection) {
        // check for timeout
        if (rejection.status === 0) {
          var errorMessage = 'timeout';
          JL('Angular.Ajax').fatalException({
            errorMessage: errorMessage,
            status: rejection.status,
            config: rejection.config
          }, rejection.data);
        }
        return $q.reject(rejection);
      }
    };
  });

angular.module('ngApp')
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('c_JSNLogInterceptor');
  });
