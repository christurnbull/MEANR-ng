'use strict';

/**
 * @ngdoc decorator
 * @name ngApp.JSNLog
 * @license MIT
 * @copyright 2016 Chris Turnbull <https://github.com/christurnbull>
 * @description
 * Add JSNLog functionality to the $exceptionHandler provider
 * http://jsnlog.com/Documentation/HowTo/AngularJsErrorHandling
 * http://www.bennadel.com/blog/2542-logging-client-side-errors-with-angularjs-and-stacktrace-js.htm
 */

angular.module('ngApp')
  .config(['$provide', function($provide) {
    $provide.decorator('$exceptionHandler', ['$delegate', '$window', 'appCfg', '$injector',
    function($delegate, $window, appCfg, $injector) {

        var host = appCfg.host.name + appCfg.host.path;

        var beforeSend = function(xhr) {

          var route = $injector.get('$route').current.$$route;
          var routeInfo = JSON.stringify({
            controller: route.controller,
            templateUrl: route.templateUrl,
            url: $window.location.href
          });

          xhr.setRequestHeader('JSNLog-Route', routeInfo);

          var token = $window.localStorage.getItem('token');
          if (token) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
          }
        };

        // jsnlog options
        JL.setOptions({
          enabled: true,
          maxMessages: 5,
          defaultAjaxUrl: host + '/audit/jsnlog',
          defaultBeforeSend: beforeSend
        });

        return function(exception, cause) {

          // call jsnlog
          try {
            JL('Angular').fatalException(cause, exception);
          } catch (err) {
            console.log('Warning: server-side logging failed');
          }

          // Calls the original $exceptionHandler.
          $delegate(exception, cause);
        };
    }]);
  }]);
