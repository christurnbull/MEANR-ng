'use strict';

/**
 * @ngdoc overview
 * @name ngApp
 * @description Main module of the application
 * @license MIT
 * @copyright 2016 Chris Turnbull <https://github.com/christurnbull>
 */
angular
  .module('ngApp', [
    'ngAnimate',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngMessages',
    'angular-cache',
    'ui.bootstrap',
    'angular.filter',
    'smart-table',
    'validation.match',
    'updateMeta',
    'angularPayments',
    'ngResponseButton',
    'ngUaIcons',
    'ngSetFocus',
    'ngStorage',
    'angular-loading-bar',
    'angulartics',
    'angulartics.google.analytics',
    'oc.lazyLoad',
    'angular-scroll-animate',
    'duScroll'
  ])
  .constant('appCfg', {
    appName: 'MEANr',
    host: {
      name: 'http://0.0.0.0:3000',
      path: ''
//             name:'https://meanr.io',
  //            path:'/api'
    }
  })
  .config(function($routeProvider, $locationProvider) {

    $routeProvider
      .when('/', {
        templateUrl: 'views/core/c_main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/core/c_about.html',
        controller: 'AboutCtrl'
      })
      .when('/signin', {
        templateUrl: 'views/core/c_signin.html',
        controller: 'SigninCtrl'
      })
      .when('/signup', {
        templateUrl: 'views/core/c_signup.html',
        controller: 'SignupCtrl'
      })
      .when('/profile', {
        templateUrl: 'views/core/c_profile.html',
        controller: 'ProfileCtrl'
      })
      .when('/admin/audit', {
        templateUrl: 'views/core/c_audit.html',
        controller: 'AuditCtrl'
      })
      .when('/admin/audit/security', {
        templateUrl: 'views/core/c_security.html',
        controller: 'SecurityCtrl'
      })
      .when('/admin/audit/JSNLog', {
        templateUrl: 'views/core/c_JSNLog.html',
        controller: 'JSNLogCtrl'
      })
      .when('/admin/users', {
        templateUrl: 'views/core/c_users.html',
        controller: 'UsersCtrl'
      })
      .when('/admin/routes', {
        templateUrl: 'views/core/c_routes.html',
        controller: 'RoutesCtrl'
      })
      .when('/admin/banned', {
        templateUrl: 'views/core/c_banned.html',
        controller: 'BannedCtrl'
      })
      .when('/reset/:hashid', {
        templateUrl: 'views/core/c_reset.html',
        controller: 'ResetCtrl'
      })
      .when('/confirm/:hashid', {
        templateUrl: 'views/core/c_confirm.html',
        controller: 'ConfirmCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
    $locationProvider
      .hashPrefix('!')
      .html5Mode(false);
    // use hashbang to improve SEO
    // https://googlewebmastercentral.blogspot.co.uk/2015/10/deprecating-our-ajax-crawling-scheme.html
  })
  .run(function($route) {
    // fix for ng-include nested in ng-view
    // https://github.com/angular/angular.js/issues/1213
    //$route.reload();

    // speed up actions on mobile browsers and makes focusing on elements work better
    FastClick.attach(document.body);
  });
