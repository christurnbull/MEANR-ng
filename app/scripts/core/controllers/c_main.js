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

    // trigger animated title
    $scope.title = false;
    var animateTO = $timeout(function() {
      $scope.title = true;
    }, 200);

    $scope.$on('$destroy', function() {
      $timeout.cancel(animateTO);
    });


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



  });
