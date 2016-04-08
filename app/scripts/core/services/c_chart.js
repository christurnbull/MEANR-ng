'use strict';

/**
 * @ngdoc service
 * @name ngApp.Chart
 * @license MIT
 * @copyright 2016 Chris Turnbull <https://github.com/christurnbull>
 * @description Service to create and set NVD3 charts
 */
angular.module('ngApp')
  .service('c_chart', function Chart($window, $ocLazyLoad, $q) {

    var deferred = $q.defer();

    var deps = [
      'https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.16/d3.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/nvd3/1.8.2/nv.d3.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/nvd3/1.8.2/nv.d3.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/angular-nvd3/1.0.5/angular-nvd3.min.js'
    ];

    function D3Config() {

      return {
        srcData: [],
        lineNode: {
          options: {
            chart: {
              type: 'multiChart',
              height: 300,
              margin: {
                top: 20,
                right: 20,
                bottom: 40,
                left: 55
              },
              x: function(d) {
                return d.x;
              },
              y: function(d) {
                return d.y;
              },
              useInteractiveGuideline: true,
              interpolate: 'basis',
              color: $window.d3.scale.category10().range(),
              xAxis: {
                axisLabel: 'Date/Time',
                tickFormat: function(d) {
                  return $window.d3.time.format('%X')(new Date(d));
                }
              },
              yAxis1: {
                axisLabel: 'ms',
                tickFormat: function(d) {
                  return $window.d3.format(',f')(d);
                },
                axisLabelDistance: -20,
              },
              yAxis2: {
                axisLabel: 'ms',
                tickFormat: function(d) {
                  return $window.d3.format(',f')(d);
                },
              },
            },
            title: {
              enable: true,
              text: 'Node Stats'
            },
          },
          data: []
        },
        lineSystem: {
          options: {
            chart: {
              type: 'multiChart',
              height: 300,
              margin: {
                top: 20,
                right: 20,
                bottom: 40,
                left: 55
              },
              x: function(d) {
                return d.x;
              },
              y: function(d) {
                return d.y;
              },
              useInteractiveGuideline: true,
              interpolate: 'basis',
              //            color: $window.d3.scale.category10().range(),
              xAxis: {
                axisLabel: 'Date/Time',
                tickFormat: function(d) {
                  return $window.d3.time.format('%X')(new Date(d));
                }
              },
              yAxis1: {
                axisLabel: 'CPU %',
                tickFormat: function(d) {
                  return $window.d3.format(',f')(d);
                },
                axisLabelDistance: -20,
              },
              yAxis2: {
                axisLabel: 'RAM (MB)',
                tickFormat: function(d) {
                  return $window.d3.format(',f')(d);
                },
              },
            },
            title: {
              enable: true,
              text: 'System Stats'
            },
          },
          data: []
        },
        hbar: {
          options: {
            chart: {
              type: 'multiBarHorizontalChart',
              height: 300,
              x: function(d) {
                return d.label;
              },
              y: function(d) {
                return d.value;
              },
              color: $window.d3.scale.category10().range(),
              showControls: true,
              showValues: true,
              duration: 500,
              xAxis: {
                showMaxMin: false
              },
              yAxis: {
                axisLabel: 'Values'
              }
            },
          },
          data: [],
          properties: {
            p1: 'method',
            p2: '_none'
          },
          dropdown: [
            '_none',
            'userId',
            'persist',
            'ip',
            'country',
            'method',
            'route',
            '-',
            'action',
            'context',
            '--',
            'name',
            'msg',
            'code',
          ]
        },
        setData: function(data, p1, p2) {

          if (!data) {
            data = this.srcData;
          } else {
            this.srcData = data;
          }
          p1 = p1 ? p1 : this.hbar.properties.p1;
          p2 = p2 ? p2 : this.hbar.properties.p2;
          this.hbar.properties.p1 = p1;
          this.hbar.properties.p2 = p2;

          var hbar = [],
            lineNode = [],
            lineSystem = [];
          var cpu = [],
            lag = [],
            mem = [],
            dur = [],
            p1count = {},
            p2count = {};
          for (var i = 0; i < data.length; i++) {
            cpu.push({
              x: data[i].timestamp,
              y: data[i].cpu
            });
            lag.push({
              x: data[i].timestamp,
              y: data[i].lag
            });
            mem.push({
              x: data[i].timestamp,
              y: data[i].memory / 1024 / 1024
            });
            dur.push({
              x: data[i].timestamp,
              y: data[i].duration
            });

            if (p1 === 'persist' && data[i][p1] === null) {
              data[i][p1] = 'false';
            }
            if (p1 === 'code' && data[i][p1] === null) {
              data[i][p1] = 200;
            }
            if (typeof p1count[data[i][p1]] === 'undefined') {
              p1count[data[i][p1]] = 0;
            }
            p1count[data[i][p1]]++;

            if (p2 === 'persist' && data[i][p2] === null) {
              data[i][p2] = 'false';
            }
            if (p2 === 'code' && data[i][p2] === null) {
              data[i][p2] = 200;
            }
            if (typeof p2count[data[i][p2]] === 'undefined') {
              p2count[data[i][p2]] = 0;
            }
            p2count[data[i][p2]]++;
          }

          var p1vals = [],
            p2vals = [],
            k;
          for (k in p1count) {
            if (k !== 'undefined') {
              p1vals.push({
                label: k,
                value: p1count[k]
              });
            }
          }
          for (k in p2count) {
            if (k !== 'undefined') {
              p2vals.push({
                label: k,
                value: p2count[k]
              });
            }
          }
          if (p1 !== '_none') {
            hbar.push({
              key: p1,
              values: p1vals
            });
          }
          if (p2 !== '_none') {
            hbar.push({
              key: p2,
              values: p2vals
            });
          }

          lineNode = [
            {
              key: 'Event Loop Lag (ms)',
              values: lag,
              type: 'line',
              yAxis: 1
            },
            {
              key: 'Response Time (ms)',
              values: dur,
              type: 'line',
              yAxis: 1
            },
          ];
          lineSystem = [
            {
              key: 'CPU %',
              values: cpu,
              type: 'line',
              yAxis: 1
            },
            {
              key: 'Memory (MB)',
              values: mem,
              type: 'area',
              yAxis: 2
            },
          ];

          this.hbar.data = hbar;
          this.lineNode.data = lineNode;
          this.lineSystem.data = lineSystem;
        },
        deps: deps
      };
    }


    if (typeof $window.d3 === 'undefined') {
      $ocLazyLoad.load(deps[0]).then(function() {
        deps.shift();
        $ocLazyLoad.load(deps).then(function() {
          deferred.resolve(new D3Config());
        });
      });
    } else {
      deferred.resolve(new D3Config());
    }

    return deferred.promise;

  });
