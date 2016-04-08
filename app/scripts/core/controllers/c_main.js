'use strict';

/**
 * @ngdoc function
 * @name ngApp.controller:MainCtrl
 * @license MIT
 * @copyright 2016 Chris Turnbull <https://github.com/christurnbull>
 * @description Main frontpage
 */
angular.module('ngApp')
  .controller('MainCtrl', function($scope, $timeout, $localStorage, c_user, c_api, c_metaUpdate) {

    /**
     * Init
     */
    var api = c_api;
    $scope.api = api;
    var user = c_user;
    $scope.user = user;
    $scope.meta = c_metaUpdate();
    $scope.meta.title = 'MEANr - A MEAN relational stack';
    $scope.$storage = $localStorage;


    /**
     * Private
     */


    /**
     * Public
     */

    /**
     * Stripe Donate
     */

    $scope.stripeData = {};
    /*
	$scope.stripeData={
	  amount: 5,
	  number: '4242424242424242',
	  name: 'Mr P Body',
	  expiry: '01/19',
	  cvc: '123',
	  email: 'test@test.com',
	  customer: user.userId
	};
    */

    $scope.donate = function(form) {

      // handle validation errors
      form.trySubmit = 'error';
      if (form.$invalid) {
        var err = form.$error[Object.keys(form.$error)[0]][0]; // get 'first' error
        $scope.$broadcast(err.$name); // set focus
        err.$dirty = true; // set as dirty to trigger popover
        return;
      }
      form.trySubmit = '';

      var charge = $scope.stripeData;
      charge.currency = $scope.$storage.userCapabilities.currency.code || 'usd';
      charge.customer = user.userId;

      return api.stripe.donate(charge, function(res) {
        $scope.payment = {
          result: 'success',
          amount: $scope.stripeData.amount
        };
        $scope.stripeData = {};
      }, function(res) {
        $scope.payment = {
          result: 'error',
          msg: res.data[0].msg
        };
      });
    };

    $scope.tada = function($el) {
      $el.removeClass('hidden');
      $el.addClass('animated tada');
    };

    $scope.$on('duScrollspy:becameActive', function($event, $element, $target) {
      $element.addClass('navbar-inverse');
    });
    $scope.$on('duScrollspy:becameInactive', function($event, $element, $target) {
      $element.removeClass('navbar-inverse');
    });

    $scope.carousel = {
      interval: 4000,
      slides: [
        {
          image: 'https://pixabay.com/static/uploads/photo/2013/07/13/09/40/database-155892_960_720.png',
          text: 'MySQL',
          pos: '50% 50%'
        },
        {
          image: 'https://pixabay.com/static/uploads/photo/2014/12/29/17/39/code-583073_960_720.jpg',
          text: 'ExpressJS',
          pos: '50% 50%'
        },
        {
          image: 'https://pixabay.com/static/uploads/photo/2015/09/17/16/40/book-944462_960_720.jpg',
          text: 'AngularJS 1.5.x',
          pos: '60% 40%'
        },
        {
          image: 'https://pixabay.com/static/uploads/photo/2015/04/23/17/41/node-js-736399_960_720.png',
          text: 'NodeJS'
        },
        {
          image: 'https://pixabay.com/static/uploads/photo/2015/10/30/10/02/matrix-1013611_960_720.jpg',
          text: 'relational'
        }
      ]
    };

  });
