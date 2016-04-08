'use strict';

/**
 * @ngdoc function
 * @name ngApp.controller:SecurityCtrl
 * @license MIT
 * @copyright 2016 Chris Turnbull <https://github.com/christurnbull>
 * @description Security audit logs
 */
angular.module('ngApp')
  .controller('SecurityCtrl', function($scope, $routeParams, c_api, c_chart, c_metaUpdate) {

    /**
     * Init
     */
    var api = c_api;
    $scope.api = api;
    $scope.meta = c_metaUpdate();


    $scope.serverFilter = {
      loading: false,
      nores: false,
      data: {
        from: new Date(Date.now() + -1 * 24 * 3600 * 1000),
        to: new Date(),
        limit: 1000,
        chart: 'security'
      },
      update: function() {
        getData(this.data);
      },
      reset: function() {
        this.data = {
          from: new Date(Date.now() + -1 * 24 * 3600 * 1000),
          to: new Date(),
          limit: 1000,
          chart: 'security'
        };
        getData(this.data);
      },
    };


    setInterval(function() {
      if ($scope.autorefresh.enabled) {
        $scope.serverFilter.data.to = new Date();
        getData($scope.serverFilter.data);
      }
    }, 1000);



    /**
     * Private
     */
    function getD3Config() {

      c_chart.then(function(cfg) {
        $scope.chart = cfg;
        getData($scope.serverFilter.data);
      });
    }

    function getData(criteria) {

      api.admin.audit(criteria, function(res) {
        $scope.audit = res;
        $scope.chart.setData(res);
      }, function(res) {
        api.message.set(res);
      });
    }

    getD3Config();



    /**
     * Public
     */
    $scope.autorefresh = {
      enabled: false,
      toggle: function() {
        this.enabled = !this.enabled;
      }
    };


    $scope.typeahead = function(key, val) {
      var req = {
        chart: 'security'
      };
      req[key] = val;
      return api.admin.typeahead(req).$promise;
    };


    $scope.datepicker = {
      from: {
        opened: false
      },
      to: {
        opened: false
      },
      open: function(type) {
        $scope.datepicker[type].opened = true;
      },
      meridian: false
    };

  });
