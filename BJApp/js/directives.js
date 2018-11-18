'use strict';

/* Directives */

var BJAppDirectives = angular.module('BJAppDirectives', []);
BJAppDirectives.directive('bjappMenu', function () {
    return {
        restrict: 'A',
        templateUrl: 'partials/menu.html',
        controller: "MenuCtrl",
        link: function (scope, el, attrs) {
            scope.label = attrs.menuTitle;

        }
    };
});
BJAppDirectives.directive('bjappMenu2', function () {
    return {
        restrict: 'A',
        templateUrl: 'partials/menutop.html',
        controller: "MenuTopCtrl",
        link: function (scope, el, attrs) {
        }
    };
});
BJAppDirectives.directive('bjappBackButton', ['$window', function ($window) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            elem.bind('click', function () {
                $window.history.back();
            });
        }
    };
}]);

BJAppDirectives.directive('bjappImgcache',  function ($rootScope) {

    return {
        restrict: 'A',
        scope: {
            bjBg: '@',
            bjSrc: '@'
        },
        link: function(scope, el, attrs) {

            var setImg = function(type, el, src) {

                ImgCache.getCachedFileURL(src, function(src, dest) {
                    var img_src = dest;
                    if(type === 'bg') {
                        el.css({'background-image': 'url(' + img_src + ')' });
                    } else {
                        el.attr('src', img_src);
                    }
                });
            }

            var loadImg = function(type, el, src) {


                ImgCache.isCached(src, function(path, success) {

                    if (success) {
                        setImg(type, el, src);
                    } else {
                        if (BJAppHelp.helpers.IsOnline($rootScope).Online) {
                            ImgCache.cacheFile(src, function () {
                                setImg(type, el, src);
                            });
                        };
                    }

                });
            }

            attrs.$observe('bjSrc', function(src) {
                loadImg('src', el, src);
            });

            attrs.$observe('bjBg', function(src) {
                    loadImg('bg', el, src);
        });

        }
    };
});

BJAppDirectives.directive('ngImgcache', function () {

    return {
        restrict: 'A',
        link: function (scope, el, attrs) {

            attrs.$observe('ngSrc', function (src) {

                ImgCache.isCached(src, function (path, success) {

                    if (success) {
                        ImgCache.useCachedFile(el);

                    } else {

                        ImgCache.cacheFile(src, function () {
                            ImgCache.useCachedFile(el);
                        });
                    }
                });

            });
        }
    };
});

