'use strict';

/**
 * @ngdoc function
 * @name ngApp.controller:RoutesCtrl
 * @license MIT
 * @copyright 2016 Chris Turnbull <https://github.com/christurnbull>
 * @description API server routes
 */
angular.module('ngApp')
  .controller('RoutesCtrl', function($scope, $routeParams, c_api, c_socketio, c_chart, c_metaUpdate) {

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
    function getRoutes() {
      api.admin.routes(function(res) {
        $scope.routes = res[0];
      }, function(res) {
        api.message.set(res);
      });
    }

    getRoutes();


    function getData() {
      var query = {
        from: $scope.test.task.timestamp,
        to: new Date(Date.now() + 3600 * 1000),
        limit: 5000,
        route: $scope.test.req.path
      };

      api.admin.audit(query, function(res) {
        query.chart = 'security';
        api.admin.audit(query, function(resSecurity) {
          var r = res.concat(resSecurity);
          chart.setData(r);
          $scope.test.chart = true;
          if ($scope.test.state === 'done') {
            $scope.test.state = 'finished';
          }
        }, function(res) {
          api.message.set(res);
        });
      }, function(res) {
        api.message.set(res);
      });
    }



    /**
     * Public
     */
    socketio.on('err', function(data) {
      data.status = 400;
      api.message.set(data);
      $scope.test.state = 'err';
    });


    socketio.on('/admin/minigun', function(data) {
      $scope.test.task = data[0].task;
      $scope.test.report = data[0].report;
      chart.setData(null, 'msg', 'code');
      setTimeout(function() {
        getData();
        if (data[0].done) {
          $scope.test.state = 'done';
        }
      }, 1000);
    });


    $scope.test = {
      req: {
        duration: 2,
        rps: 5,
        samples: 2,
        route: null,
        path: null,
        method: null
      },
      task: null,
      result: null,
      chart: null,
      state: null,
      run: function(route, i) {
        this.req.route = route.route.route;
        this.req.path = route.route.path;
        this.req.method = route.route.method;
        socketio.emit('/admin/minigun', this.req);
        this.state = 'running';
      }
    };

  });
