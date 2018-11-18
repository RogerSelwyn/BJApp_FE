'use strict'

var webDBServices = angular.module('webDBServices', ['ngResource']);
/* var baseURL = "http://localhost/laravel/bjapp/public/" */
/* var baseURL = "http://www.selwyn.org.uk:3030/" */

webDBServices.factory('webSpeciesType', ['$resource',
    function ($resource) {
        return $resource(apiURL + "speciestype/:id", {}, {
            get: { method: 'GET', cache: true, isArray: false },
            query: { method: 'GET', cache: true, isArray: true }
        });
    }]);

webDBServices.factory('webSpecies', ['$resource',
    function ($resource) {
        return $resource(apiURL + "species/:id", {}, {
            get: { method: 'GET', cache: true, isArray: false },
            query: { method: 'GET', cache: true, isArray: true }
});
    }]);

webDBServices.factory('webLocation', ['$resource',
    function ($resource) {
        return $resource(apiURL + "location/:id", {}, {
            get: { method: 'GET', cache: true, isArray: false },
            query: { method: 'GET', cache: true, isArray: true }
        });
    }]);

webDBServices.factory('webRegion', ['$resource',
    function ($resource) {
        return $resource(apiURL + "region/:id", {}, {
            get: { method: 'GET', cache: true, isArray: false },
            query: { method: 'GET', cache: true, isArray: true }
        });
    }]);

webDBServices.factory('webPostcodeSearch', ['$resource',
    function ($resource) {
        return $resource(apiURL + "postcodesearch/:searchstr", {}, {
            get: { method: 'GET', cache: true, isArray: true },
            query: { method: 'GET', cache: true, isArray: true }
});
    }]);

webDBServices.factory('webSetting', ['$resource',
    function ($resource) {
        return $resource(apiURL + "setting/:settingname", {}, {
            get: { method: 'GET', cache: true, isArray: false },
            query: { method: 'GET', cache: true, isArray: true }
        });
    }]);

webDBServices.factory('webSpeciesPhoto', ['$resource',
    function ($resource) {
        return $resource(apiURL + "speciesphoto/:id", {}, {
            get: { method: 'GET', cache: true, isArray: false },
            query: { method: 'GET', cache: true, isArray: true }
        });
    }]);

webDBServices.factory('webSpeciesLocation', ['$resource',
    function ($resource) {
        return $resource(apiURL + "specieslocation/:id", {}, {
            get: { method: 'GET', cache: true, isArray: false },
            query: { method: 'GET', cache: true, isArray: true }
        });
    }]);
