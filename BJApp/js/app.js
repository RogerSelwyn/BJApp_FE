/* chapter2.app.js */

'use strict';
/* App Module */
var BJAppHelp = BJAppHelp || {};
var defaultOfflineStatus = false;
var defaultPincodeSecured = false;
var defaultTimeoutTime = 0;
var defaultInitialZoom = 7;
var db;
var defaultHQPhotos = false;
var defaultBarcodeEnable = false;
var defaultBarcodeEnable = false;
var defaultTimeoutPage = 'home';
/* var baseURL = "http://localhost/laravel/bjapp/public/";
 var baseURL = "http://www.selwyn.org.uk:3030/"; */
var baseURL = "https://mnhp-app.s3-eu-west-1.amazonaws.com/";
var apiURL = "https://sleepy-mesa-6480.herokuapp.com/index.php/";
var eBirdapiURL = "http://ebird.org/ws1.1/"


BJAppHelp.helpers = {
    IsOnline: function(rootScope) {
        if (!navigator.onLine) {
            return ({ Online: false, Status: "nowifi", Desc: "Offline, no network" });
        } else if (rootScope.forceOffline) {
            return ({ Online: false, Status: "nonet", Desc: "Online, but configured offline" });
        } else {
            return ({ Online: true, Status: "wifi", Desc: "Online, all systems go" });
        };
    },
    SetWifiIcon: function (rootScope) {
        if (typeof rootScope.forceOffline == 'undefined') {
            var forceOffline = window.localStorage.getItem('forceOffline');
            rootScope.forceOffline = false;
            if (forceOffline == "true") {
                rootScope.forceOffline = true;
            }
            if (forceOffline == "false") {
                rootScope.forceOffline = false;
            };
        };
        var WifiIcon = BJAppHelp.helpers.IsOnline(rootScope).Status;
        return (WifiIcon);
    },

    IsCachedImage: function($q, url) {
        var deferred = $q.defer();
        ImgCache.isCached(url, function (path, success) {
            if (success) {
                deferred.resolve();
            } else {
                deferred.reject();
            };
        });
        return deferred.promise;
    }
};


var BJApp = angular.module('BJApp', [
    'ngRoute',
    'ngSanitize',
    'ngAnimate', 
    'ngMap',
    'ngCordova',
    'ngProgress',
    'ngTouchend',
    'angular-flexslider',
    'BJAppControllers',
    'DBServices',
    'webDBServices',
    'cacheDBServices',
    'BJAppDirectives',
    'eBirdServices'
]);

BJApp.config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {
        $routeProvider.
            when('/', {
                templateUrl: 'partials/splash.html',
                controller: 'SplashCtrl'
            }).when('/home', {
                templateUrl: 'partials/home.html',
                controller: 'HomeCtrl'
            }).when('/searchspecies/:id', {
                templateUrl: 'partials/searchspecies.html',
                controller: 'SearchSpeciesCtrl'
            }).when('/species/:id', {
                templateUrl: 'partials/species.html',
                controller: 'SpeciesCtrl',
            }).when('/location/:id', {
                templateUrl: 'partials/location.html',
                controller: 'LocationCtrl'
            }).when('/searchlocation', {
                templateUrl: 'partials/searchlocation.html',
                controller: 'SearchLocationCtrl'
            }).when('/searchmap', {
                templateUrl: 'partials/searchmap.html',
                controller: 'SearchMapCtrl'
            }).when('/about', {
                templateUrl: 'partials/about.html',
                controller: 'AboutCtrl'
            }).when('/pincode', {
                templateUrl: 'partials/pincode.html',
                controller: 'PincodeCtrl'
            }).when('/settings', {
                templateUrl: 'partials/settings.html',
                controller: 'SettingsCtrl'
            });
        $locationProvider.html5Mode(false).hashPrefix('!');
    }]);

BJApp.run(function ($window, $rootScope, $cordovaSQLite) {
    $rootScope.$on('$routeChangeStart', function(event, next, current) { 
        $rootScope.homeScreen = false;
        var leavingNgView = document.getElementsByClassName('page')[0];

        var wlifeScroll = document.getElementById('wlifeScroll');
        wlifeScroll.className += ' noScroll'
        setTimeout(function () {
            var wlifeScroll = document.getElementById('wlifeScroll');
            wlifeScroll.className = wlifeScroll.className.replace(/(?:^|\s)noScroll(?!\S)/g, '')
        }, 1500);

        var fromPosition = 0;
        var toPosition = 0
        $rootScope.PreviousPage = '';
        if (typeof current != 'undefined') {
            $rootScope.PreviousPage = current.$$route.originalPath;
            switch (current.$$route.originalPath) {
                case '/':
                    fromPosition = -1;
                    break;
                case '/home':
                    fromPosition = 0;
                    break;
                case '/searchspecies/:id':
                    fromPosition = 1;
                    break;
                case '/searchlocation':
                    fromPosition = 2;
                    break;
                case '/searchmap':
                    fromPosition = 3;
                    break;
                case '/species/:id':
                    fromPosition = 11;
                    break;
                case '/location/:id':
                    fromPosition = 12;
                    break;
                case '/about':
                    fromPosition = 21;
                    break;
                case '/settings':
                    fromPosition = 22;
                    break;
                case '/pincode':
                    fromPosition = 23;
                    break;
                default:
                    break;
            }
        }
        $rootScope.CurrentPage = next.$$route.originalPath;
        switch (next.$$route.originalPath) {
            case '/':
                toPosition = -1;
                break;
            case '/home':
                $rootScope.homeScreen = true;
                toPosition = 0;
                break;
            case '/searchspecies/:id':
                toPosition = 1;
                break;
            case '/searchlocation':
                toPosition = 2;
                break;
            case '/searchmap':
                toPosition = 3;
                break;
            case '/species/:id':
                toPosition = 11;
                break;
            case '/location/:id':
                toPosition = 12;
                break;
            case '/about':
                toPosition = 21;
                break;
            case '/settings':
                toPosition = 22;
                break;
            case '/pincode':
                toPosition = 22;
                break;
            default:
                break;
        }
        var forward = toPosition > fromPosition;
        var anim = '';
        if (fromPosition == toPosition) {
            anim = '';
        } else if (fromPosition == -1) {
            anim = 'animated fadeIn';
        } else if (fromPosition == 3 && (toPosition == 11 || toPosition == 12)) {
            anim = 'animated scrolledBottomIn';
        } else if (fromPosition - toPosition == 10) {
            anim = 'animated fadeOut';
        } else if (fromPosition > 10 && toPosition > 0 && toPosition < 10) {
            anim = 'animated scrolledBottomOut';
        } else if (toPosition > 20) {
            anim = 'animated fadeIn';
        } else if (fromPosition > 20) {
            anim = 'animated fadeOut';
        } else if (fromPosition == 0) {
            anim = 'animated scrolledBottomIn';
        } else if (toPosition == 0) {
            anim = 'animated scrolledBottomOut';
        } else if (toPosition > 10) {
            anim = 'animated fadeIn';
        } else if (fromPosition > 10) {
            anim = 'animated fadeOut';
        } else if (forward) {
            anim = 'animated scrolledLeft';
        } else {
            anim = 'animated scrolledRight';
        };
        if (typeof current != 'undefined') {
            if (typeof current.scope != 'undefined') {
                event.targetScope.pageClass = anim;
                leavingNgView.className = 'page ' + anim;
            };
        };
    });
    
    $window.addEventListener("offline", function () {
        $rootScope.$apply(function () {
            $rootScope.wifiicon = BJAppHelp.helpers.SetWifiIcon($rootScope);
            $rootScope.IsOnline = BJAppHelp.helpers.IsOnline($rootScope);
        });
    }, false);

    $window.addEventListener("online", function () {
        $rootScope.$apply(function () {
            $rootScope.wifiicon = BJAppHelp.helpers.SetWifiIcon($rootScope);
            $rootScope.IsOnline = BJAppHelp.helpers.IsOnline($rootScope);
        });
    }, false);

    $rootScope.orientation = window.orientation;
    $window.addEventListener('orientationchange', function () {
        $rootScope.orientation = window.orientation;
    });

    SetupApplication();
    SetupTimeout()

    function SetupApplication() {
        if (typeof $rootScope.forceOffline == 'undefined') {
            var forceOffline = window.localStorage.getItem('forceOffline');
            $rootScope.forceOffline = defaultOfflineStatus;
            if (forceOffline == "true") {
                $rootScope.forceOffline = true;
            }
            if (forceOffline == "false") {
                $rootScope.forceOffline = false;
            };
        };

        if (typeof $rootScope.pincodeSecured == 'undefined') {
            var pincodeSecured = window.localStorage.getItem('pincodeSecured');
            $rootScope.pincodeSecured = defaultPincodeSecured;
            if (pincodeSecured == "true") {
                $rootScope.pincodeSecured = true;
            }
            if (pincodeSecured == "false") {
                $rootScope.pincodeSecured = false;
            };
        };

        if (typeof $rootScope.timeoutTime == 'undefined') {
            var timeoutTime = window.localStorage.getItem('timeoutTime');
            $rootScope.timeoutTime = defaultTimeoutTime;
            if (timeoutTime != null) {
                $rootScope.timeoutTime = parseInt(timeoutTime);
            }
        };

        if (typeof $rootScope.initialZoom == 'undefined') {
            var initialZoom = window.localStorage.getItem('initialZoom');
            $rootScope.initialZoom = defaultInitialZoom;
            if (initialZoom != null) {
                $rootScope.initialZoom = parseInt(initialZoom);
            }
        };

        $rootScope.barcodeBackURL = '';
        $rootScope.baseURL = baseURL;

        if (window.cordova) {
            console.log("Start Cordova database");
            db = $cordovaSQLite.openDB({ name: 'BJApp.db', location: 'default' });
            console.log("Cordova database");
        } else {
            console.log("Start Browser database");
            db = window.openDatabase("BJAppDB", '1', 'BJ MNHP App DB', 1024 * 1024 * 100);
            console.log("Browser database");
        };

        if (typeof $rootScope.HQPhotos == 'undefined') {
            var HQPhotos = window.localStorage.getItem('HQPhotos');
            $rootScope.HQPhotos = defaultHQPhotos;
            if (HQPhotos == "true") {
                $rootScope.HQPhotos = true;
            }
            if (HQPhotos == "false") {
                $rootScope.HQPhotos = false;
            };
        };

        if (typeof $rootScope.BarcodeEnable == 'undefined') {
            var BarcodeEnable = window.localStorage.getItem('BarcodeEnable');
            $rootScope.BarcodeEnable = defaultBarcodeEnable;
            if (BarcodeEnable == "true") {
                $rootScope.BarcodeEnable = true;
            }
            if (BarcodeEnable == "false") {
                $rootScope.BarcodeEnable = false;
            };
        };

        if (typeof $rootScope.TimeoutPage == 'undefined') {
            var TimeoutPage = window.localStorage.getItem('TimeoutPage');
            $rootScope.TimeoutPage = defaultTimeoutPage;
            if (TimeoutPage == "home") {
                $rootScope.TimeoutPage = 'home';
            }
            if (TimeoutPage == "splash") {
                $rootScope.TimeoutPage = 'splash';
            };
        };


    };

    function SetupTimeout() {
        var myTimer;
        $('body').bind('touchstart', function () {
            clearInterval(myTimer);
        });
        $('body').bind('touchend', function () {
                if ($rootScope.timeoutTime > 0) {
                    myTimer = setInterval(function () {
                        if ($rootScope.TimeoutPage == 'home') {
                            if ($rootScope.CurrentPage != '/home') {
                                window.location.href = "#!home";
                            }
                        } else {
                            if ($rootScope.CurrentPage != '/') {
                                window.location.href = "#!/";
                            }
                        }
                }, $rootScope.timeoutTime);
            };
        });
    };

});