'use strict';

/**
 * @ngdoc function
 * @name ngApp.controller:AboutCtrl
 * @license MIT
 * @copyright 2016 Chris Turnbull <https://github.com/christurnbull>
 * @description About the app
 */
angular.module('ngApp')
  .controller('AboutCtrl', function($scope, $routeParams, $timeout, c_api, c_user, c_metaUpdate) {

    /**
     * Init
     */
    var api = c_api;
    $scope.api = api;
    var user = c_user;
    $scope.user = user;
    $scope.meta = c_metaUpdate();

    $scope.show = false;
    var animateTO = $timeout(function() {
      $scope.show = true;
    }, 200);

    $scope.$on('$destroy', function() {
      $timeout.cancel(animateTO);
    });

    /**
     * Private
     */


    /**
     * Public
     */


  });
