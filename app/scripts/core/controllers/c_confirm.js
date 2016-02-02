'use strict';

/**
 * @ngdoc function
 * @name ngApp.controller:ConfirmCtrl
 * @license MIT
 * @copyright 2016 Chris Turnbull <https://github.com/christurnbull>
 * @description Confirm user signup
 */
angular.module('ngApp')
  .controller('ConfirmCtrl', function($scope, $routeParams, $location, c_api, c_user, c_metaUpdate) {

    /**
     * Init
     */
    var api = c_api;
    $scope.api = api;
    var user = c_user;
    $scope.user = user;
    $scope.meta = c_metaUpdate();


    /**
     * Private
     */
    function confirm() {
      api.auth.confirm({
        hashid: $routeParams.hashid
      }, function(res) {
        api.message.set(res);
        setTimeout(function() {
          if (user.authed) {
            user.getCapabilities();
            $location.path('/profile');
          } else {
            $location.path('/signin');
          }
        }, 2000);
      }, function(res) {
        api.message.set(res);
      });
    }

    confirm();


    /**
     * Public
     */

  });
