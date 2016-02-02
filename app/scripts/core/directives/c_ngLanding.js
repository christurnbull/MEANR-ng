'use strict';

/**
 * @ngdoc function
 * @name ngApp.directive:ngLanding
 * @license MIT
 * @copyright 2016 Chris Turnbull <https://github.com/christurnbull>
 * @description removes landing html when ng-app is finished loading
 */
angular.module('ngApp')
  .directive('ngLanding', function($window) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
		angular.element($window.document.querySelector('html')).removeClass('ng-landing-html');
		angular.element($window.document.querySelector('body')).removeClass('ng-landing-body');
		angular.element($window.document.querySelector('.ng-landing' )).remove();
      }
    };
  });
