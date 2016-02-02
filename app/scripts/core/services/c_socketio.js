'use strict';

/**
 * @ngdoc service
 * @name ngApp.socketio
 * @license MIT
 * @copyright 2016 Chris Turnbull <https://github.com/christurnbull>
 * @description SocketIO service
 */
angular.module('ngApp')
  .factory('c_socketio', function($rootScope, $localStorage, appCfg, c_user, c_api) {

    var api = c_api;
    var user = c_user;
    var socket = io.connect(appCfg.host.name, {
      path: appCfg.host.path + '/socket.io'
    });
    $rootScope.$storage = $localStorage;

    return {
      init: function() {
        socket.removeAllListeners();
      },
      on: function(eventName, callback) {
        socket.on(eventName, function() {
          var args = arguments,
            evt = eventName;
          $rootScope.$apply(function() {
            if (evt === 'err') {
              //console.log(evt,args[0]);
            }
            callback.apply(socket, args);
          });
        });
      },
      emit: function(eventName, data, callback) {
        // socketio doesn't allow custom headers so put token in the message data
        if (typeof(data) === 'undefined') {
          data = {
            token: $rootScope.$storage.token
          };
        } else {
          if (typeof(data) === 'object') {
            data.token = $rootScope.$storage.token;
          }
        }

        socket.emit(eventName, data, function() {
          var args = arguments;
          $rootScope.$apply(function() {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        });
      }
    };
  });
