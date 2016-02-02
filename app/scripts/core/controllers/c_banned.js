'use strict';

/**
 * @ngdoc function
 * @name ngApp.controller:BannedCtrl
 * @license MIT
 * @copyright 2016 Chris Turnbull <https://github.com/christurnbull>
 * @description List of banned users
 */
angular.module('ngApp')
  .controller('BannedCtrl', function($scope, $routeParams, c_api, c_metaUpdate) {

    /**
     * Init
     */
    var api = c_api;
    $scope.api = api;
    $scope.meta = c_metaUpdate();


    /**
     * Private
     */
    function getBanned() {
      api.admin.banned(function(res) {
        $scope.ips = res;
      }, function(res) {
        api.message.set(res);
      });
    }

    getBanned();

    /**
     * Public
     */
    $scope.remove = function(row, i) {
      var d = {
        ip: row.ip
      };
      if (row.hash) {
        d.hash = row.hash;
      }
      api.admin.unban(d, function(res) {
        api.message.set(res);
        $scope.ips.splice(i, 1);
      }, function(res) {
        api.message.set(res);
      });
    };

  });
