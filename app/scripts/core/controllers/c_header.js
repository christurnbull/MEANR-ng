'use strict';

/**
 * @ngdoc function
 * @name ngApp.controller:HeaderCtrl
 * @license MIT
 * @copyright 2016 Chris Turnbull <https://github.com/christurnbull>
 * @description Header nav bar
 */
angular.module('ngApp')
  .controller('HeaderCtrl', function($scope, $location, $localStorage, c_user) {

    /**
     * Init
     */
    var user = c_user;
    $scope.user = user;
    $scope.$storage = $localStorage;

    user.getCapabilities();


    /**
     * Private
     */


    /**
     * Public
     */
    $scope.isActive = function(viewLocation) {
      return viewLocation === $location.path();
    };

    $scope.signout = function() {
      user.signout();
    };

  });
