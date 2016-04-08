'use strict';
/*jshint multistr: true */

/**
 * @ngdoc function
 * @name ngApp.directive:ngSocialShare
 * @license MIT
 * @copyright 2016 Chris Turnbull <https://github.com/christurnbull>
 * @description Create a share button with social icons
 * Requires boostrap css, bootstrap-ui, ionicons and bootrap-social
 * Caveat - social networks crawl the site to read the open grah protocol data.
 *  They don't render the page so the og meta tags on the index page will be used
 */
angular.module('ngApp')
  .directive('ngSocialShare', function($location) {
    return {
      template: '\
		<div class="">\
		  <div ng-if="data.noPopup" ng-include="template"></div>\
		  <div ng-if="!data.noPopup">\
			<button class="btn ng-social-share" popover-placement="{{data.placement}}" \
			  uib-popover-template="template"\
			  popover-is-open="data.show">\
			  <i class="ion-share"></i> <label>Share</label>\
			</button>\
		  </div>\
		  <script type="text/ng-template" id="share-popover.html">\
			<div class="ng-social-share">\
			  <div style="display: {{display}};">\
                <span ng-repeat="network in data.networks" \
				  ng-click="shareWindow(network)">\
                  <div title="{{network | ucfirst}}"\
                    class="btn btn-social-icon btn-{{network}}">\
					<i class="ion-social-{{network}}"></i>\
                  </div>\
                </span>\
                <span ng-if="data.email" ng-click="shareWindow(\'email\')"> \
                  <a title="Email"\
                    class="btn btn-social-icon btn-github">\
					<i class="ion-email"></i>\
                  </a>\
                </span>\
			  </div>\
			</div>\
			</script>\
		</div>',
      restrict: 'A',
      replace: true,
      scope: {
        data: '=ngSocialShare'
      },
      link: function(scope, element, attrs) {

        var defaults = {
          placement: 'top',
          networks: [
			                                                  'facebook',
			                                                  'twitter',
			                                                  'linkedin',
			                                                  'pinterest',
			                                                  'reddit',
			                                                  'google'
		                                          ],
          email: true,
          url: window.location.href,
          title: document.title,
          desc: document.querySelector('meta[name="description"]').content,
          vertical: false,
          noPopup: false,
          urls: {
            facebook: 'https://www.facebook.com/sharer/sharer.php?u=<URL>',
            twitter: 'https://twitter.com/share?url=<URL>&text=<DESC>',
            linkedin: 'https://www.linkedin.com/shareArticle?url=<URL>&title=<TITLE>&summary=<DESC>',
            pinterest: 'http://pinterest.com/pin/create/link/?url=<URL>&description=<DESC>',
            reddit: 'https://reddit.com/submit?url=<URL>&title=<TITLE>',
            google: 'https://plus.google.com/share?url=<URL>',
            email: 'mailto:?subject=<TITLE>&body=<DESC>',
          }
        };

        if (!scope.data) {
          scope.data = {
            vertical: defaults.vertical
          };
        }
        scope.display = scope.data.vertical === true ? 'table-caption' : 'inline-flex';
        scope.template = 'share-popover.html';

        // fill missing data with defaults
        scope.data = {
          placement: scope.data.placement ? scope.data.placement : defaults.placement,
          networks: scope.data.networks ? scope.data.networks : defaults.networks,
          url: scope.data.url ? scope.data.url : defaults.url,
          title: scope.data.title ? scope.data.title : defaults.title,
          desc: scope.data.desc ? scope.data.desc : defaults.desc,
          email: scope.data.email !== null ? scope.data.email : defaults.email,
          noPopup: scope.data.noPopup !== null ? scope.data.noPopup : defaults.noPopup
        };

        // url encode
        var encoded = {
          url: encodeURIComponent(scope.data.url),
          title: encodeURIComponent(scope.data.title),
          desc: encodeURIComponent(scope.data.desc)
        };

        // open a new window for the share network
        scope.shareWindow = function(network) {

          scope.data.show = false;
          var url = defaults.urls[network]
            .replace('<URL>', encoded.url)
            .replace('<TITLE>', encoded.title)
            .replace('<DESC>', encoded.desc);

          var target = network === 'email' ? '_self' : '_blank';
          window.open(url, target, 'toolbar=no, scrollbars=yes, resizable=yes, top=100, left=300, width=480, height=480');
        };


      }
    };
  });
