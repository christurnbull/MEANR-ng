'use strict';

/**
 * @ngdoc function
 * @name ngApp.controller:UsersCtrl
 * @license MIT
 * @copyright 2016 Chris Turnbull <https://github.com/christurnbull>
 * @description List users
 */
angular.module('ngApp')
  .controller('UsersCtrl', function($scope, $routeParams, c_api, c_chart, c_metaUpdate, c_socketio) {

    /**
     * Init
     */
    var api = c_api;
    $scope.api = api;
    var chart = c_chart;
    $scope.chart = chart;
    var socketio = c_socketio;
    socketio.init();
    $scope.meta = c_metaUpdate();


    /**
     * Private
     */
    function getUsers() {
      api.admin.get(function(res) {
        $scope.users = res;
      }, function(res) {
        api.message.set(res);
      });
    }

    getUsers();



    /**
     * Public
     */
    $scope.toggleTokens = function(user) {

      if (!user.toggleTokens) {
        api.user.get({
          userId: user.id
        }, function(res) {
          user.tokens = res[0].tokens;
        }, function(res) {
          api.message.set(res);
        });
      }
      user.toggleTokens = !user.toggleTokens;
    };


    $scope.toggleEnabled = function(user) {

      api.admin.ban({
        userId: user.id
      }, {
        enabled: !user.enabled
      }, function(res) {
        user.enabled = res[0].msg;
      }, function(res) {
        api.message.set(res);
      });

    };


    $scope.revoke = function(userId, tid, token) {
      api.auth.revoke({
        userId: userId,
        tid: tid
      }, {
        token: token
      }, function(res) {
        getUsers();
      }, function(res) {
        api.message.set(res);
      });
    };


    $scope.changePass = function(user) {

      api.admin.password({
        userId: user.id
      }, {
        password: user.newPass
      }, function(res) {
        user.togglePassword = false;
      }, function(res) {
        api.message.set(res);
      });
    };


    /**
     * SocketIO examples
     */
    socketio.on('err', function(data) {
      data.status = 400;
      api.message.set(data);
    });
    socketio.on('/ping', function(data) {
      api.message.set(data);
    });
    socketio.on('/dong', function(data) {
      api.message.set(data);
    });

    /*
	console.log('emit ping');
	socketio.emit('/ping',{msg:'/ping "body" data'});
    console.log('emit ding');
	socketio.emit('/ding',{msg:'/ding "body" data'});
    */


  });
