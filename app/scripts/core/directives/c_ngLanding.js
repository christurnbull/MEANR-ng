'use strict';

/**
 * @ngdoc function
 * @name ngApp.directive:ngLanding
 * @license MIT
 * @copyright 2016 Chris Turnbull <https://github.com/christurnbull>
 * @description removes landing html when ng-app is finished loading
 */
angular.module('ngApp')
  .directive('ngLanding', function($window, $timeout) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {

        element.css('height', '100%');
        $timeout(function() {
          angular.element($window.document.querySelectorAll('.ng-landing-remove')).remove();
        });

      }
    };
  });
