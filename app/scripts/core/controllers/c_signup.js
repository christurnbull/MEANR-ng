'use strict';

/**
 * @ngdoc function
 * @name ngApp.controller:SignupCtrl
 * @license MIT
 * @copyright 2016 Chris Turnbull <https://github.com/christurnbull>
 * @description Signup a user
 */
angular.module('ngApp')
  .controller('SignupCtrl', function($scope, $route, $location, c_api, c_user, c_metaUpdate) {

    /**
     * Init
     */
    var api = c_api;
    $scope.api = api;
    var user = c_user;
    $scope.user = user;
    $scope.meta = c_metaUpdate();

    $scope.formData = {};
    $scope.passwordRegex = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,16}$';
    $scope.signedup = false;


    /**
     * Private
     */


    /**
     * Public
     */
    $scope.signup = function(form) {

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
      var formData = {
        email: $scope.formData.email,
        password: $scope.formData.password,
        persist: $scope.formData.persist
      };
      return api.auth.signup(formData, function(res) {
        $scope.signedup = true;
        api.message.set(res);
        user.signin(res[0].token);
        $scope.formData = {};
        formData = null;
        setTimeout(function() {
          $location.url('/profile');
        }, 2000);
      }, function(res) {
        api.message.set(res);
      });

    };

  });
