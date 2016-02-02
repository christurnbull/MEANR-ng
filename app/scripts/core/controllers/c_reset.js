'use strict';

/**
 * @ngdoc function
 * @name ngApp.controller:ResetCtrl
 * @license MIT
 * @copyright 2016 Chris Turnbull <https://github.com/christurnbull>
 * @description Reset a user password
 */
angular.module('ngApp')
  .controller('ResetCtrl', function($scope, $routeParams, $location, c_api, c_metaUpdate) {

    /**
     * Init
     */
    var api = c_api;
    $scope.api = api;
    $scope.meta = c_metaUpdate();

    $scope.passwordRegex = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,16}$';


    /**
     * Private
     */


    /**
     * Public
     */
    $scope.reset = function(form) {

      // handle validation errors
      form.trySubmit = 'error';
      if (form.$invalid) {
        var err = form.$error[Object.keys(form.$error)[0]][0]; // get 'first' error
        $scope.$broadcast(err.$name); // set focus
        err.$dirty = true; // set as dirty to trigger popover
        return;
      }
      form.trySubmit = '';

      // submit
      $scope.formData.hashid = $routeParams.hashid;
      delete $scope.formData.cpassword;
      return api.auth.reset($scope.formData, function(res) {
        api.message.set(res);
        setTimeout(function() {
          $location.path('/signin');
        }, 2000);
      }, function(res) {
        api.message.set(res);
      });

    };

  });
