'use strict';

/**
 * @ngdoc function
 * @name ngApp.filter:parseJson
 * @license MIT
 * @copyright 2016 Chris Turnbull <https://github.com/christurnbull>
 * @description Parse JSON sting
 */
angular.module('ngApp')
  .filter('parseJson', function() {
    return function(input) {
      var res = input;
      try {
        if (input && typeof input === 'string') {
          res = JSON.parse(input);
        }
      } catch (e) {
        res = input;
      }
      return res;
    };

  });
