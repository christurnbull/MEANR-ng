'use strict';

/**
 * @ngdoc function
 * @name ngApp.controller:HeaderCtrl
 * @license MIT
 * @copyright 2016 Chris Turnbull <https://github.com/christurnbull>
 * @description Header nav bar
 */
angular.module('ngApp')
  .controller('HeaderCtrl', function($scope, $location, $localStorage, c_user, $timeout) {

    /**
     * Init
     */
    var user = c_user;
    $scope.user = user;
    $scope.$storage = $localStorage;
    user.getCapabilities();

    $scope.path = '/';
    $scope.navbarCollapsed = true;


    var TOcheck, TOfirst, TOsecond;

    // nabvar immediately if not on root url
    $timeout(function() {
      if ($scope.path !== '/') {
        $scope.navbar = true;
        $scope.fork = true;
      }
    });

    // phase in elements
    TOfirst = $timeout(function() {
      $scope.title = true;
      $scope.chevron = true;

      TOsecond = $timeout(function() {
        $scope.navbar = true;
        $scope.fork = true;
      }, 900);
    }, 200);

    $scope.$on('$destroy', function() {
      $timeout.cancel(TOfirst);
      $timeout.cancel(TOsecond);
      $timeout.cancel(TOcheck);
    });



    /**
     * Private
     */


    /**
     * Public
     */
    $scope.isActive = function(viewLocation) {
      return viewLocation === $location.path();
    };

    $scope.signout = function() {
      user.signout();
    };

    $scope.$on('$routeChangeSuccess', function(next, current) {
      if (current.$$route) {
        $scope.path = current.$$route.originalPath;

        // fix for jumpy page in mobile browesers with 100% height
        var el = angular.element(document.querySelector('html'));
        el[0].style.height = el[0].clientHeight + 'px';
      }
    });

  });
