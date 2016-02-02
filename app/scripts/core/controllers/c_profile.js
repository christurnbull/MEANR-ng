'use strict';

/**
 * @ngdoc function
 * @name ngApp.controller:ProfileCtrl
 * @license MIT
 * @copyright 2016 Chris Turnbull <https://github.com/christurnbull>
 * @description User profile
 */
angular.module('ngApp')
  .controller('ProfileCtrl', function($scope, c_user, c_api, c_metaUpdate, $localStorage) {

    /**
     * Init
     */
    var api = c_api;
    $scope.api = api;
    var user = c_user;
    $scope.user = user;
    $scope.meta = c_metaUpdate();
    $scope.$storage = $localStorage;


    /**
     * Private
     */
    function getUser() {
      $scope.formData = {};
      api.user.get({
        userId: user.userId
      }, function(res) {
        $scope.formData = res[0];
        $scope.persistTokens = res[0].persistTokens;
        $scope.formData.name = $scope.$storage.userCapabilities.passport.displayName || res[0].name;
      }, function(res) {
        api.message.set(res);
      });
    }

    getUser();


    /**
     * Public
     */
    $scope.reset = function() {
      api.auth.resetReq({
        email: $scope.formData.email
      }, function(res) {
        api.message.set(res);
      }, function(res) {
        api.message.set(res);
      });
    };


    $scope.save = function() {
      var data = {};
      if ($scope.$storage.userCapabilities.provider) {
        data.email = $scope.formData.email;
      } else {
        data.name = $scope.formData.name;
      }

      return api.user.update({
        userId: user.userId
      }, data, function(res) {
        user.getCapabilities();
      }, function(res) {
        api.message.set(res);
      });
    };


    $scope.revoke = function(tid, token) {
      api.auth.revoke({
        userId: user.userId,
        tid: tid
      }, {
        token: token
      }, function(res) {
        api.message.set(res);
        getUser();
      }, function(res) {
        api.message.set(res);
      });
    };


    $scope.resend = function() {
      api.auth.resend({
        userId: user.userId
      }, function(res) {
        api.message.set(res);
      }, function(res) {
        api.message.set(res);
      });
    };


  });
