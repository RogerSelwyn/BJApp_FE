'use strict'

var eBirdServices = angular.module('eBirdServices', ['ngResource']);

eBirdServices.factory('RecentNearbyNotableObservations', ['$resource',
    function ($resource) {
        return $resource(eBirdapiURL + "data/notable/geo/recent?lng=:lng&lat=:lat&dist=:dist&back=30&maxResults=:max&hotspot=true&detail=full&fmt=json", {}, {
            get: { method: 'GET', cache: false, isArray: true }
        });
    }]);

eBirdServices.factory('RecentNearbyObservations', ['$resource',
    function ($resource) {
        return $resource(eBirdapiURL + "data/obs/geo/recent?lng=:lng&lat=:lat&dist=:dist&back=30&maxResults:max&hotspot=true&fmt=json", {}, {
            get: { method: 'GET', cache: false, isArray: true }
        });
    }]);

