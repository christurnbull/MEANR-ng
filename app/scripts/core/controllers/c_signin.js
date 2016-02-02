'use strict';

/**
 * @ngdoc function
 * @name ngApp.controller:SigninCtrl
 * @license MIT
 * @copyright 2016 Chris Turnbull <https://github.com/christurnbull>
 * @description Sign in a user
 */

angular.module('ngApp')
  .controller('SigninCtrl', function($rootScope, $scope, $location, $window, $routeParams, $timeout, $localStorage, c_metaUpdate, c_user, c_api, appCfg) {

    /**
     * Init
     */
    var api = c_api;
    $scope.api = api;
    var user = c_user;
    $scope.user = user;
    $scope.meta = c_metaUpdate();
    $scope.$storage = $localStorage;
    var host = appCfg.host.name + appCfg.host.path;

    $scope.formData = {
      persist: false
    };
    //    $scope.formData = {email: 'a@a.com', password: 'Zz123456', persist: false};
    //    $scope.formData = {email: 'admin@meanr.io', password: '123',persist: false};
    //    $scope.formData = {email: 'joe@meanr.io', password: '123', persist: false};

    $scope.provider = false;
    delete $scope.$storage.providerSignIn;

    // check if is provider window or watch for provider callback
    if ($routeParams.provider) {
      $scope.provider = true;
      $scope.$storage.providerSignIn = $routeParams.provider;
      var closeTO = $timeout(function() {
        $window.close();
      }, 300);
    } else {
      $scope.$watch('$storage.providerSignIn', function() {
        if ($scope.$storage.providerSignIn) {
          signinProvider();
        }
      });
    }

    $scope.$on('$destroy', function() {
      $timeout.cancel(closeTO);
    });



    /**
     * Private
     */
    function signinProvider() {
      $scope.provider = true;
      var d = {
        sid: $scope.$storage.providerSignIn,
        persist: $scope.formData.persist
      };
      delete $scope.$storage.providerSignIn;

      api.auth.provider(d, function(res) {
        user.signin(res[0].token);
        $location.url('/profile');
      }, function(res) {
        api.message.set(res);
      });
    }



    /**
     * Public
     */
    $scope.signin = function(form) {

      // handle validation errors
      form.trySubmit = 'error';
      if (form.$invalid) {
        var err = form.$error[Object.keys(form.$error)[0]][0]; // get 'first' error
        $scope.$broadcast(err.$name); // set focus
        if (err.$name === 'email') {
          form[err.$name].tooltip = 'Enter an Email Address';
        }
        if (err.$name === 'password') {
          form[err.$name].tooltip = 'Enter a Password';
        }
        err.$dirty = true; // set as dirty to trigger popover

        return;
      }

      // submit
      return api.auth.signin($scope.formData, function(res) {
        user.signin(res[0].token);
        $location.url('/profile');
      }, function(res) {
        if (res.data[0].msg === 'Not a registered email') {
          $scope.$broadcast('email'); // set focus
          form.email.tooltip = res.data[0].msg;
          // set as not valid && dirty to trigger popover
          form.email.$valid = false;
          form.email.$dirty = true;
        } else if (res.data[0].msg === 'Incorrect password') {
          $scope.$broadcast('password'); // set focus
          form.password.tooltip = res.data[0].msg;
          // set as not valid && dirty to trigger popover
          form.password.$valid = false;
          form.password.$dirty = true;
        } else {
          api.message.set(res);
        }
      });
    };


    $scope.reset = function(form) {

      form.trySubmit = 'error';
      if (!$scope.formData.email) {
        $scope.$broadcast('email'); // set focus
        form.email.tooltip = 'Enter your email address';
        form.email.$dirty = true; // set as dirty to trigger popover
        return;
      }
      form.trySubmit = '';

      delete $scope.formData.password;
      delete $scope.formData.persist;
      api.auth.resetReq($scope.formData, function(res) {
        api.message.set(res);
      }, function(res) {
        api.message.set(res);
      });
    };


    $scope.signinProviderReq = function(provider) {

      var url = host + '/auth/provider?provider=' + provider;
      var w = $window.open(url, appCfg.appName + 'ProviderWindow', 'toolbar=no, scrollbars=yes, resizable=yes, top=100, left=300, width=480, height=480');
    };


  });
