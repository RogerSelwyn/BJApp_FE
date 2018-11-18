"use strict";

var ngTouchendDirectives = angular.module("ngTouchend", []);
ngTouchendDirectives.directive("ngTouchend", function () {
  return {
    controller: function ($scope, $element, $attrs) {
      $element.bind('touchend', onTouchEnd);
      
      function onTouchEnd(event) {
        var method = $element.attr('ng-touchend');
        $scope.$event = event;
        $scope.$apply(method);
      };
    }
  };
});

ngTouchendDirectives.directive("ngTouchstart", function () {
    return {
        controller: function ($scope, $element, $attrs) {
            $element.bind('touchstart', onTouchStart);

            function onTouchStart(event) {
                var method = $element.attr('ng-touchstart');
                $scope.$event = event;
                $scope.$apply(method);
            };
        }
    };
});
