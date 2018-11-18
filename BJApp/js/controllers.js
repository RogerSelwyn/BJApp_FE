'use strict';
/* Controllers */

var BJAppControllers =
    angular.module('BJAppControllers', []);
var backdoorPincode = 230395;
var backdoorPinbutton = 3;
var infowindowLocation = null;
var infowindoweBird = null;
var randomScale = 20;

BJAppControllers.controller('SearchSpeciesCtrl', 
    function SearchSpeciesCtrl($rootScope, $scope, $routeParams, SpeciesType, Species) {
        $rootScope.topMenu = { menuItem: 'Species', backButton: false };

        UpdateSpeciesType($routeParams.id);

        $scope.CustomSearchSpecies = function (species) {
            $rootScope.speciesSearch = $scope.speciesSearch;
            if ($scope.speciesSearch == '') { return true; }
            if (angular.lowercase(species.CommonName).indexOf(angular.lowercase($scope.speciesSearch)) !== -1) {
                return true;
            } else {
                return false;
            }
        };

        $scope.LoadSpecies = function () {
            Species.get({ id: $rootScope.selectedSpecies }).then(
                function success(response) {
                    console.log("Success:" + JSON.stringify(response));
                    $scope.species = response;
                    var arrayLength = $scope.species.speciesphotos.length;
                    for (var i = 0; i < arrayLength; i++) {
                        if ($scope.species.speciesphotos[i].IsDefault == 1) {
                            $scope.species.MediumPhotoLocation = $scope.species.speciesphotos[i].MediumPhotoLocation;
                            $scope.species.LargePhotoLocation = $scope.species.speciesphotos[i].LargePhotoLocation;
                        };
                    };
                },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                }
            );

        };

        $scope.selectSpecies = function (species) {
            $rootScope.selectedSpecies = species.id;
            $rootScope.selectedSpeciesTop = $('#selectionList').scrollTop();
            $scope.LoadSpecies();
        };

        $scope.speciesTypeButton = function (speciesType) {
            UpdateSpeciesType(speciesType.id);
        };

        function UpdateSpeciesType(speciesTypeId) {
            $scope.selectedSpeciesTypeId = speciesTypeId;
            SpeciesType.query({}).then(
                function success(response) {
                    console.log("Success:" + JSON.stringify(response));
                    if (response != $scope.speciesTypeList) {
                        $scope.speciesTypeList = response;
                    };
                    if ($scope.selectedSpeciesTypeId == 0) {
                        $scope.selectedSpeciesTypeId = window.localStorage.getItem('selectedSpeciesTypeId')
                        var idFound = false;
                        if ($scope.selectedSpeciesTypeId != null) {
                            for (var i = 0; i < $scope.speciesTypeList.length; i++) {
                                if ($scope.speciesTypeList[i].id == $scope.selectedSpeciesTypeId) {
                                    idFound = true;
                                }
                            };
                        };
                        if (idFound == false) { $scope.selectedSpeciesTypeId = null; };
                        if ($scope.selectedSpeciesTypeId == null) {
                            $scope.selectedSpeciesTypeId = $scope.speciesTypeList[0].id;
                        };
                    };
                    getSpeciesType($scope.selectedSpeciesTypeId);
                },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                }
            );
        };
        function getSpeciesType(speciesTypeId) {
            if (typeof $rootScope.speciesSearch == 'undefined') {
                $rootScope.speciesSearch = '';
            };
            if (typeof $rootScope.selectedSpecies == 'undefined') {
                $rootScope.selectedSpecies = '';
                $rootScope.selectedSpeciesTop = 0;
            };
            if (typeof $rootScope.speciesTypeId == 'undefined') {
                $rootScope.speciesTypeId = speciesTypeId;
            };
            if ($rootScope.speciesTypeId != speciesTypeId) {
                $rootScope.selectedSpecies = '';
                $rootScope.speciesSearch = '';
                $rootScope.speciesTypeId = speciesTypeId;
                $rootScope.selectedSpeciesTop = 0;
            };


            $scope.speciesType = '';
            SpeciesType.get({ id: speciesTypeId }).then(
                function success(response) {
                    console.log("Success:" + JSON.stringify(response));
                    $scope.selectedSpeciesType = response;
                    window.localStorage.setItem('selectedSpeciesTypeId', $scope.selectedSpeciesType.id);
                    if ($rootScope.selectedSpecies == '') {
                        $rootScope.selectedSpecies = $scope.selectedSpeciesType.species[0].id;
                        $rootScope.selectedSpeciesTop = 0;
                        $scope.species = $scope.selectedSpeciesType.species[0];
                    }
                    else {
                        $scope.LoadSpecies();
                    };
                    var arrayLength = $scope.selectedSpeciesType.species.length;
                    for (var i = 0; i < arrayLength; i++) {
                        Species.get({ id: $scope.selectedSpeciesType.species[i].id });
                    };
                    setTimeout(function () {
                        $('#selectionList').scrollTop($rootScope.selectedSpeciesTop);
                        $('button').removeClass('buttonSelected');
                        var btnid = '[id="stid' + $scope.selectedSpeciesTypeId + '"]';
                        $(btnid).addClass('buttonSelected');
                        $(btnid).button('toggle');
                    }, 1);
                },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                }
            );
        };

    });

BJAppControllers.controller('SpeciesCtrl',  
    function SpeciesCtrl($q, $rootScope, $scope, $routeParams, Species) {
        var backButton = true;
        var menuItem = 'Species';
        if ($rootScope.barcodeBackURL != '') {
            backButton = false;
            menuItem = 'Species Search'
            $rootScope.barcodeBackURL = '';
        };
        $rootScope.topMenu = { menuItem: menuItem, backButton: backButton };

        var speciesId = $routeParams.id;
        $scope.species = '';
        Species.get({ id: speciesId }).then(
            function success(response) {
                console.log("Success:" + JSON.stringify(response));
                var species = response;
                var speciesPhotos = response.speciesphotos;
                species.speciesphotos = [];
                $scope.species = species;

                $scope.totalPhotos = speciesPhotos.length;
                $scope.processedPhotos = 0;
                $scope.photosProcessed = [];
                var arrayLength = speciesPhotos.length;
                for (var i = 0; i < arrayLength; i++) {
                    checkCacheandAdd(speciesPhotos[i]);
                };
            },
            function error(errorResponse) {
                console.log("Error:" + JSON.stringify(errorResponse));
            }
        );

        $scope.openPhoto = function (speciesPhoto) {
            var url = $rootScope.baseURL + speciesPhoto.OriginalLocation;
            BJAppHelp.helpers.IsCachedImage($q, url).then(
                function success(response) {
                    ImgCache.getCachedFileURL(url, function (url, dest) {
                        var ref = window.open('imageloader.html?photo=' + dest, '_blank', 'location=no,enableViewportScale=yes');
                    });
                },
                function error(errorResponse) {
                    if (BJAppHelp.helpers.IsOnline($rootScope).Online) {
                        var ref = window.open($rootScope.baseURL + 'imageloader.html?photo=' + speciesPhoto.OriginalLocation, '_blank', 'location=no,enableViewportScale=yes');
                    } else {
                        BootstrapDialog.show({
                            type: BootstrapDialog.TYPE_WARNING,
                            title: 'Warning',
                            message: 'Wildlife Locator is currently working offline, full size photo cannot be opened at this time. Please go online to open.',
                            buttons: [{
                                label: 'Close',
                                action: function (dialog) { dialog.close();}
                            }]
                        });
                    };
                });
        };

        $scope.startpreloadPhoto = function (slider) {
            $('#speciesSliderWrapper').removeClass('loading');
            $('#speciesCarouselWrapper').removeClass('loading');
            var url = $rootScope.baseURL + $scope.species.speciesphotos[slider.element.animatingTo].OriginalLocation;
            if (BJAppHelp.helpers.IsOnline($rootScope).Online) {
                BJAppHelp.helpers.IsCachedImage($q, url).then(
                function success(response) {
                },
                function error(errorResponse) {
                    ImgCache.cacheFile(url);
                });
            };
        };

        $scope.preloadPhoto = function (slider) {
            $('#speciesCarouselWrapper li').removeClass('flex-active-slide');
            var currli = slider.element.animatingTo + 1;
            $('#speciesCarouselWrapper li:nth-child(' + currli + ')').addClass('flex-active-slide');
            $scope.startpreloadPhoto(slider);
        };


        function checkCacheandAdd(speciesPhoto) {
            if ($rootScope.HQPhotos) {
                var photoURL = speciesPhoto.OriginalLocation;
            } else {
                var photoURL = speciesPhoto.LargePhotoLocation;
            };
            var url = $rootScope.baseURL + photoURL;
            if (BJAppHelp.helpers.IsOnline($rootScope).Online) {
                $scope.processedPhotos += 1;
                $scope.species.speciesphotos.push(speciesPhoto);
                if (speciesPhoto.IsDefault == 1) {
                    $scope.species.MediumPhotoLocation = speciesPhoto.MediumPhotoLocation;
                    $scope.species.LargePhotoLocation = speciesPhoto.LargePhotoLocation;
                };
            } else {
                BJAppHelp.helpers.IsCachedImage($q, url).then(
                function success(response) {
                    if (speciesPhoto.IsDefault == 1) {
                        $scope.species.MediumPhotoLocation = speciesPhoto.MediumPhotoLocation;
                        $scope.species.LargePhotoLocation = speciesPhoto.LargePhotoLocation;
                    };
                    $scope.photosProcessed.push(speciesPhoto);
                    $scope.processedPhotos += 1;
                    if ($scope.processedPhotos = $scope.totalPhotos) {
                        setTimeout(function () {
                            $scope.species.speciesphotos = $scope.photosProcessed;
                            $scope.$apply();
                        }, 1);
                    };
                },
                function error(errorResponse) {
                    $scope.processedPhotos += 1;
                    if ($scope.processedPhotos = $scope.totalPhotos) {
                        setTimeout(function () {
                            $scope.species.speciesphotos = $scope.photosProcessed;
                            $scope.$apply();
                        }, 1);
                    };
                });
            };
        };

    });

BJAppControllers.controller('LocationCtrl', 
    function LocationCtrl($q, $rootScope, $scope, $routeParams, Location, Species) {
        $rootScope.topMenu = { menuItem: 'Location', backButton: true };

        if (typeof $rootScope.selectedLocationSpecies == 'undefined') {
            $rootScope.selectedLocationSpecies = '';
            $rootScope.selectedLocationSpeciesTop = 0;
            $rootScope.locationTop = 0;
        };

        var locationId = $routeParams.id;
        $scope.location = '';
        Location.get({ id: locationId }).then(
            function success(response) {
                console.log("Success:" + JSON.stringify(response));
                $scope.location = response;
                if ($rootScope.HQPhotos) {
                    var photoURL = response.OriginalLocation;
                } else {
                    var photoURL = response.LargePhotoLocation;
                };
                checkCacheandAdd(photoURL);
                if ($rootScope.selectedLocationSpecies == '') {
                    $rootScope.selectedLocationSpecies = $scope.location.species[0].id;
                    $rootScope.selectedLocationSpeciesTop = 0;
                    $rootScope.locationTop = 0;
                    $scope.species = $scope.location.species[0];
                }
                else {
                    $scope.LoadSpecies();
                };

                var arrayLength = $scope.location.species.length;
                for (var i = 0; i < arrayLength; i++) {
                    Species.get({ id: $scope.location.species[i].id });
                };
                setTimeout(function () {
                    $('#selectionList').scrollTop($rootScope.selectedLocationSpeciesTop);
                    $('#pageContainer').scrollTop($rootScope.locationTop);
                }, 1);
            },
            function error(errorResponse) {
                console.log("Error:" + JSON.stringify(errorResponse));
            }
        );

        $scope.openPhoto = function (location) {
            var url = $rootScope.baseURL + location.OriginalLocation;
            BJAppHelp.helpers.IsCachedImage($q, url).then(
                function success(response) {
                    ImgCache.getCachedFileURL(url, function (url, dest) {
                        var ref = window.open('imageloader.html?photo=' + dest, '_blank', 'location=no,enableViewportScale=yes');
                    });
                },
                function error(errorResponse) {
                    if (BJAppHelp.helpers.IsOnline($rootScope).Online) {
                        var ref = window.open($rootScope.baseURL + 'imageloader.html?photo=' + location.OriginalLocation, '_blank', 'location=no,enableViewportScale=yes');
                    } else {
                        BootstrapDialog.show({
                            type: BootstrapDialog.TYPE_WARNING,
                            title: 'Warning',
                            message: 'Wildlife Locator is currently working offline, full size photo cannot be opened at this time. Please go online to open.',
                            buttons: [{
                                label: 'Close',
                                action: function (dialog) { dialog.close(); }
                            }]
                        });
                    };
                });
        };

        $scope.LoadSpecies = function () {
            Species.get({ id: $rootScope.selectedLocationSpecies }).then(
                function success(response) {
                    console.log("Success:" + JSON.stringify(response));
                    $scope.species = response;
                    var arrayLength = $scope.species.speciesphotos.length;
                    for (var i = 0; i < arrayLength; i++) {
                        if ($scope.species.speciesphotos[i].IsDefault == 1) {
                            $scope.species.MediumPhotoLocation = $scope.species.speciesphotos[i].MediumPhotoLocation;
                            $scope.species.LargePhotoLocation = $scope.species.speciesphotos[i].LargePhotoLocation;
                        };
                    };
                },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                }
            );

        };

        $scope.selectSpecies = function (species) {
            $rootScope.selectedLocationSpecies = species.id;
            $rootScope.selectedLocationSpeciesTop = $('#selectionList').scrollTop();
            $rootScope.locationTop = $('#pageContainer').scrollTop();
            $scope.LoadSpecies();
        };

        function checkCacheandAdd(PhotoLocation) {
            var url = $rootScope.baseURL + PhotoLocation;
            if (BJAppHelp.helpers.IsOnline($rootScope).Online) {
                $scope.LocationPhotoLocation = PhotoLocation;
            } else {
                BJAppHelp.helpers.IsCachedImage($q, url).then(
                function success(response) {
                    $scope.LocationPhotoLocation = PhotoLocation;
                },
                function error(errorResponse) {
                });
            };
        };

    });

BJAppControllers.controller('SearchLocationCtrl',
    function SearchLocationCtrl($rootScope, $scope, $routeParams, PostcodeSearch, Location) {
        $rootScope.topMenu = { menuItem: 'Location', backButton: false };
        $rootScope.selectedLocationSpecies = '';
        $rootScope.selectedLocationSpeciesTop = 0;
        $rootScope.locationTop = 0;
        if (typeof $rootScope.selectedLocation == 'undefined') {
            $rootScope.selectedLocation = '';
        };

        if (typeof $rootScope.searchPostcode == 'undefined') {
            $rootScope.searchPostcode = '';
        };

        $scope.locations = [];
        PostcodeSearch.query({}).then(
            function success(response) {
                console.log("Success:" + JSON.stringify(response));
                $scope.locations = response;
                if ($scope.locations.length > 0) {
                    if ($rootScope.selectedLocation == '') {
                        $rootScope.selectedLocation = $scope.locations[0].id;
                        $scope.location = $scope.locations[0];
                    }
                    else {
                        $scope.LoadLocation();
                    };
                    var arrayLength = $scope.locations.length;
                    for (var i = 0; i < arrayLength; i++) {
                        Location.get({ id: $scope.locations[i].id });
                    };
                };
            },
            function error(errorResponse) {
                console.log("Error:" + JSON.stringify(errorResponse));
            }
        );

        $scope.LoadLocation = function () {
            Location.get({ id: $scope.selectedLocation }).then(
                function success(response) {
                    console.log("Success:" + JSON.stringify(response));
                    $scope.location = response;
                },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                }
            );
        };

        $scope.selectLocation = function (location) {
            $rootScope.selectedLocation = location.id;
            $scope.LoadLocation();
        };

        $scope.CustomSearchLocation = function (location) {
            $rootScope.searchPostcode = $scope.searchPostcode;
            if ($scope.searchPostcode == '') { return true; }
            if (angular.lowercase(location.Postcode).indexOf(angular.lowercase($scope.searchPostcode)) !== -1) {
                return true;
            } else {
                return false;
            }
        };


    });

BJAppControllers.controller('SearchMapCtrl', 
    function SearchMapCtrl($rootScope, $scope, $routeParams,  Location, NgMap, RecentNearbyNotableObservations, RecentNearbyObservations) {
        $rootScope.topMenu = { menuItem: 'Map', backButton: false };
        $rootScope.selectedLocationSpecies = '';
        $rootScope.selectedLocationSpeciesTop = 0;
        $rootScope.locationTop = 0;
        if (typeof $rootScope.filterType == 'undefined') {
            $rootScope.filterType = 'None';
        };

        if (typeof $rootScope.mapZoom == 'undefined') {
            $rootScope.mapZoom = $rootScope.initialZoom;
        };

        if (typeof $rootScope.mapLat == 'undefined') {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    $rootScope.mapLat = position.coords.latitude;
                    $rootScope.mapLng = position.coords.longitude;
                }, function () {
                    // User didn't allow location
                    $rootScope.mapLat = 0;
                    $rootScope.mapLng = 0;
                });
            } else {
                if (typeof $rootScope.currentLat == 'undefined') {
                    $rootScope.mapLat = 0;
                    $rootScope.mapLng = 0;
                } else {
                };
            };
        };

        NgMap.getMap().then(function (searchMap) {
            $scope.objMapa = searchMap;
        });
        $scope.locations = '';
        Location.query({}).then(
            function success(response) {
                console.log("Success:" + JSON.stringify(response));
                $scope.locations = response;
                if ($rootScope.mapInfoWindow.type = 'loc') {
                    var arrayLength = response.length;
                    for (var i = 0; i < arrayLength; i++) {
                        if (response[i].id == $rootScope.mapInfoWindow.id) {
                            var iwSighting = response[i];
                            NgMap.getMap().then(function (searchMap) {
                                $scope.objMapa = searchMap;
                                $scope.showLocationInfoWindow('', iwSighting);
                            });
                        };
                    };
                };
            },
            function error(errorResponse) {
                console.log("Error:" + JSON.stringify(errorResponse));
            }
        );
        SeteBirdButton($rootScope.filterType);
        if ($scope.IsOnline.Online) {
            GeteBirdData($rootScope.filterType);
        };

        $scope.showLocationInfoWindow = function (event, location) {
            Location.get({ id: location.id }).then(
                function success(response) {
                    console.log("Success:" + JSON.stringify(response));
                    var locationData = response;
                    var infoWindowContent =
                        '<div class="infoWindowOuter">' +
                        '<div class="infoWindowHeader">' +
                        '<h4><a href="#!location/' + location.id + '">' + location.LocationName + '</a></h4>' +
                        '<hr class="hrTitleDividerIW" />' +
                        '<div><a href="#!location/' + location.id + '">' + location.Latitude + ', ' + location.Longitude + '</a></div>' +
                        '<div>' + location.Address + ', ' + location.County + ', ' + location.Postcode + ', ' + location.Country + '</div>' 
                    infoWindowContent += '<div class="infoWindowBodyTitle"><b>Wildlife at the location</b></div>' +
                        '</div>' +
                        '<div class="infoWindowBody">';
                    var strComma = '';
                    var arrayLength = locationData.species.length;
                    for (var i = 0; i < arrayLength; i++) {
                        var commonName = locationData.species[i].CommonName
                        if (locationData.species[i].CommonName == locationData.species[i].LatinName) {
                            commonName = '<i>' + commonName + '</i>'
                        }
                        infoWindowContent = infoWindowContent + strComma + '<a href="#!species/' + locationData.species[i].id + '">' + commonName + '</a>';
                        strComma = ', ';
                    };
                    infoWindowContent = infoWindowContent + '</div></div></div>';
                    $scope.infowindowcontent = infoWindowContent;
                    var infoWindowID = 'loc' + location.id;
                    $scope.objMapa.showInfoWindow('map-iw', infoWindowID);
                    $rootScope.mapInfoWindow = { id: location.id, type: 'loc' }
                },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                }
            );

        };

        $scope.showeBirdInfoWindow = function (event, sighting, sightingType) {
            var sightingsAll;
            if (sightingType == "All") {
                sightingsAll = $scope.sightingsAll;
            } else {
                sightingsAll = $scope.sightingsNotableAll;
            };

            var infoWindowContent =
                '<div class="infoWindowOuter">' +
                '<div class="infoWindowHeader">' +
                '<h4>' + sighting.locName + '</h4>' +
                '<hr class="hrTitleDividerIW" />' +
                '<div>' + sighting.lat + ', ' + sighting.lng + '</div>'
            if ($rootScope.filterType == 'Notable') {
                infoWindowContent += '<div>' + sighting.subnational2Name + ', ' + sighting.subnational1Name + '</div>'
            };
            infoWindowContent += '<div class="infoWindowBodyTitle"><b>Wildlife at the location</b></div>' +
                '</div>' +
                '<div class="infoWindowBody">';
            var arrayLength = sightingsAll.length;
            for (var i = 0; i < arrayLength; i++) {
                if (sightingsAll[i].locID == sighting.locID) {
                    infoWindowContent += '<div>';
                    infoWindowContent += sightingsAll[i].comName;
                    if (sightingsAll[i].howMany > 1) {
                        infoWindowContent += ' (' + sightingsAll[i].howMany + ')';
                    };
                    infoWindowContent += ' - ' + sightingsAll[i].obsDt;
                    infoWindowContent += '</div>';
                };
            };
            infoWindowContent += '</div></div>';
            $scope.infowindowcontent = infoWindowContent;
            var infoWindowID = sightingType + sighting.locID;
            $scope.objMapa.showInfoWindow('map-iw', infoWindowID);
            $rootScope.mapInfoWindow = { id: sighting.locID, type: sightingType }

        };

        $scope.mapFilter = function (filterType) {
            if (filterType != $rootScope.filterType) {
                if (infowindoweBird) {
                    infowindoweBird.close();
                };
                if (filterType == 'Refresh') {
                    filterType = $rootScope.filterType;
                    var btnid = '[id="filter' + filterType + '"]';
                    $(btnid).focus();
                } else {
                    SeteBirdButton(filterType);
                };
                GeteBirdData(filterType);
            };
        };

        $scope.mapIdle = function () {
            NgMap.getMap().then(function (searchMap) {
                $scope.objMapa = searchMap;
                $rootScope.mapLng = $scope.objMapa.getCenter().lng();
                $rootScope.mapLat = $scope.objMapa.getCenter().lat();
//                    GeteBirdData($rootScope.filterType);
            });
        };

        $scope.btnTouchStart = function (btnname) {
            var btnid = '[id="' + btnname + '"]';
            $(btnid).removeClass('mobileHover');
        };

        $scope.btnTouchEnd = function (btnname) {
            var btnid = '[id="' + btnname + '"]';
            $(btnid).addClass('mobileHover');
        };

        $scope.$on('$routeChangeStart', function (next, current) {
            $rootScope.mapZoom = $scope.objMapa.zoom;
            $rootScope.mapLng = $scope.objMapa.getCenter().lng();
            $rootScope.mapLat = $scope.objMapa.getCenter().lat();
        });
        
        function SeteBirdButton(filterType) {
            $('button').removeClass('buttonSelected');
            var btnid = '[id="filter' + filterType + '"]';
            $(btnid).addClass('buttonSelected');
            $(btnid).button('toggle');
            if (filterType != $rootScope.filterType) {
                btnid = '[id="filter' + $rootScope.filterType + '"]';
                $(btnid).button('toggle');
            };
        }

        function GeteBirdData(filterType) {
            // Get Notable Sightings
            $rootScope.filterType = filterType;
            if ($rootScope.mapLat != 0 && BJAppHelp.helpers.IsOnline($rootScope).Online) {
                if ($rootScope.filterType == "Notable" || $rootScope.filterType == "All") {
                    RecentNearbyNotableObservations.get({ lat: $rootScope.mapLat, lng: $rootScope.mapLng, dist: 250, max: 50 },
                        function success(response) {
                            console.log("Success:" + JSON.stringify(response));
                            setTimeout(function () {
                                $scope.$apply(function () {
                                    if ($rootScope.filterType == "Notable") {
                                        $scope.sightingsAll = [];
                                        $scope.sightings = [];
                                    };
                                    $scope.sightingsNotableAll = response;
                                    $scope.sightingsNotable = processSighting(response);
                                });
                            }, 1);
                        },
                        function error(errorResponse) {
                            console.log("Error:" + JSON.stringify(errorResponse));
                        }
                    );
                };
                if ($rootScope.filterType == "All") {
                    RecentNearbyObservations.get({ lat: $rootScope.mapLat, lng: $rootScope.mapLng, dist: 50, max: 50 },
                        function success(response) {
                            console.log("Success:" + JSON.stringify(response));
                            setTimeout(function () {
                                $scope.$apply(function () {
                                    $scope.sightingsAll = response;
                                    $scope.sightings = processSighting(response);
                                });
                            }, 1);
                        },
                        function error(errorResponse) {
                            console.log("Error:" + JSON.stringify(errorResponse));
                        }
                    );
                };
                if ($rootScope.filterType == "None") {
                    setTimeout(function () {
                        $scope.$apply(function () {
                            $scope.sightingsAll = [];
                            $scope.sightings = [];
                            $scope.sightingsNotableAll = [];
                            $scope.sightingsNotable = [];
                        });
                    }, 1);
                    };
            };
        };

        function processSighting(sightings) {
            var arrayLength = sightings.length;
            var sightingsDedup = [];
            for (var i = 0; i < arrayLength; i++) {
/*                var distance = getDistanceFromLatLonInMiles($scope.currentLat, $scope.currentLng, sightings[i].lat, sightings[i].lng);
                if (distance > 10) {
                    distance = distance.toFixed(0);
                } else {
                    distance = distance.toFixed(1);
                };
                sightings[i].distance = distance; */

                sightingsDedup = DeduplicateSighting(sightings[i], sightingsDedup);
            };
            return (sightingsDedup);
        };

        function DeduplicateSighting(sighting, sightingsDedup) {
            var arrayLength = sightingsDedup.length;
            var inDedup = false;
            for (var i = 0; i < arrayLength; i++) {
                if (sighting.locID == sightingsDedup[i].locID) {
                    var inDedup = true;
                };
            };
            if (!inDedup) {
                sightingsDedup.push(sighting);
            };
            return (sightingsDedup);
        }

        function getDistanceFromLatLonInMiles(lat1, lon1, lat2, lon2) {
            var R = 6371; // Radius of the earth in km
            var dLat = deg2rad(lat2 - lat1);  // deg2rad below
            var dLon = deg2rad(lon2 - lon1);
            var a =
              Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2)
            ;
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var d = R * c; // Distance in km
            return d * 0.621371;
        }

        function deg2rad(deg) {
            return deg * (Math.PI / 180)
        }



    });

BJAppControllers.controller('AboutCtrl', 
    function AboutCtrl($rootScope, $scope, $cordovaAppVersion, Setting, $sce) {
        $rootScope.topMenu = { menuItem: 'hide', backButton: false };
        if (typeof device != 'undefined') {
            $cordovaAppVersion.getVersionNumber().then(function (version) {
                $scope.appVersion = version;
            });
        }
        Setting.get({ settingname: 'AboutText' }).then(
            function success(response) {
                console.log("Success:" + JSON.stringify(response));
                $scope.aboutText = $sce.trustAsHtml(response.SettingValue);
            },
            function error(errorResponse) {
                console.log("Error:" + JSON.stringify(errorResponse));
            }
        );
    });

BJAppControllers.controller('SettingsCtrl', 
    function SettingsCtrl($rootScope, $scope, SpeciesPhoto, Location, Setting, SpeciesType, Species, Region, SpeciesLocation, ngProgressFactory) {
        $rootScope.topMenu = { menuItem: 'hide', backButton: false };

        UpdatePage();

        $scope.submitClearCache = function () {
            ImgCache.clearCache();
            $scope.submitRefresh
        };

        $scope.submitRenewPhotoCache = function () {
            $scope.progressbar = ngProgressFactory.createInstance();
            $scope.progressbar.setHeight('10px');
            $scope.totalDownloads = 0;
            $scope.currentDownloads = 0;
            ImgCache.clearCache(downloadPhotos());
            $scope.submitRefresh
        };

        $scope.submitUpdatePhotoCache = function () {
            $scope.progressbar = ngProgressFactory.createInstance();
            $scope.progressbar.setHeight('10px');
            $scope.totalDownloads = 0;
            $scope.currentDownloads = 0;
            downloadPhotos();
            $scope.submitRefresh
        };

        $scope.submitRenewRawPhotoCache = function () {
            $scope.progressbar = ngProgressFactory.createInstance();
            $scope.progressbar.setHeight('10px');
            $scope.totalDownloads = 0;
            $scope.currentDownloads = 0;
            ImgCache.clearCache(downloadRawPhotos());
            downloadPhotos();
            $scope.submitRefresh
        };

        $scope.submitUpdateRawPhotoCache = function () {
            $scope.progressbar = ngProgressFactory.createInstance();
            $scope.progressbar.setHeight('10px');
            $scope.totalDownloads = 0;
            $scope.currentDownloads = 0;
            downloadRawPhotos();
            $scope.submitRefresh
        };

        $scope.submitDataCache = function () {
            getSettings();
            getSpeciesPhotos();
            getSpeciesTypes();
            getSpecies();
            getRegions();
            getLocations();
            getSpeciesLocations();
        };

        $scope.submitRefresh = function () {
            UpdatePage();
        };

        $scope.submitOnline = function (forceOffline) {
            $rootScope.forceOffline = forceOffline;
            window.localStorage.setItem('forceOffline', $rootScope.forceOffline);
            $rootScope.wifiicon = BJAppHelp.helpers.SetWifiIcon($rootScope);
            $rootScope.IsOnline = BJAppHelp.helpers.IsOnline($rootScope);
            $scope.submitRefresh();
        };

        $scope.submitSecure = function (secured) {
            $rootScope.pincodeSecured = secured;
            window.localStorage.setItem('pincodeSecured', $rootScope.pincodeSecured);
            $scope.submitRefresh();
        };

        $scope.submitHQPhotos = function (HQPhotos) {
            $rootScope.HQPhotos = HQPhotos;
            window.localStorage.setItem('HQPhotos', $rootScope.HQPhotos);
            $scope.submitRefresh();
        };

        $scope.submitBarcode = function (BarcodeEnable) {
            $rootScope.BarcodeEnable = BarcodeEnable;
            window.localStorage.setItem('BarcodeEnable', $rootScope.BarcodeEnable);
            $scope.submitRefresh();
        };

        $scope.submitTimeoutPage = function (TimeoutPage) {
            $rootScope.TimeoutPage = TimeoutPage;
            window.localStorage.setItem('TimeoutPage', $rootScope.TimeoutPage);
            $scope.submitRefresh();
        };

        $scope.submitTimeoutTime = function () {
            $rootScope.timeoutTime = $scope.timeoutTimeInput * 60 * 1000;
            window.localStorage.setItem('timeoutTime', $rootScope.timeoutTime);
            $scope.submitRefresh();
        };

        $scope.submitInitialZoom = function () {
            $rootScope.initialZoom = $scope.initialZoom;
            window.localStorage.setItem('initialZoom', $rootScope.initialZoom);
            $scope.submitRefresh();
        };

        function UpdatePage() {
            getCacheSize();
            $scope.timeoutTimeInput = $rootScope.timeoutTime / 60 / 1000;
            var btnidon, btnidoff;
            if ($scope.forceOffline) {
                btnidon = '#btnOffline';
                btnidoff = '#btnOnline';
            } else {
                btnidon = '#btnOnline';
                btnidoff = '#btnOffline';
            };
            $(btnidon).addClass('buttonSelected');
            $(btnidoff).removeClass('buttonSelected');

            if ($scope.pincodeSecured) {
                btnidon = '#btnSecure';
                btnidoff = '#btnInsecure';
            } else {
                btnidon = '#btnInsecure';
                btnidoff = '#btnSecure';
            };
            $(btnidon).addClass('buttonSelected');
            $(btnidoff).removeClass('buttonSelected');

            if ($scope.HQPhotos) {
                btnidon = '#btnHQPhotos';
                btnidoff = '#btnLQPhotos';
            } else {
                btnidon = '#btnLQPhotos';
                btnidoff = '#btnHQPhotos';
            };
            $(btnidon).addClass('buttonSelected');
            $(btnidoff).removeClass('buttonSelected');

            if ($scope.BarcodeEnable) {
                btnidon = '#btnEnableBarcode';
                btnidoff = '#btnDisableBarcode';
            } else {
                btnidon = '#btnDisableBarcode';
                btnidoff = '#btnEnableBarcode';
            };
            $(btnidon).addClass('buttonSelected');
            $(btnidoff).removeClass('buttonSelected');

            if ($scope.TimeoutPage == 'home') {
                btnidon = '#btnTimeoutHome';
                btnidoff = '#btnTimeoutSplash';
            } else {
                btnidon = '#btnTimeoutSplash';
                btnidoff = '#btnTimeoutHome';
            };
            $(btnidon).addClass('buttonSelected');
            $(btnidoff).removeClass('buttonSelected');
        };

        function getCacheSize() {
            var cacheSize = ImgCache.getCurrentSize() / 1024 / 1024;
            $scope.photoCacheSize = cacheSize.toFixed(2);
        };

        function downloadPhotos() {
            SpeciesPhoto.query({}).then(
                function success(response) {
                    console.log("Success:" + JSON.stringify(response));
                    $scope.totalDownloads = $scope.totalDownloads + (response.length * 3);
                    var arrayLength = response.length;
                    for (var i = 0; i < arrayLength; i++) {
                        cachePhoto(response[i].ThumbnailLocation);
                        cachePhoto(response[i].MediumPhotoLocation);
                        cachePhoto(response[i].LargePhotoLocation);
                        };
                },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                }
            );
            Location.query({}).then(
                function success(response) {
                    console.log("Success:" + JSON.stringify(response));
                    $scope.totalDownloads = $scope.totalDownloads + (response.length * 3);
                    var arrayLength = response.length;
                    for (var i = 0; i < arrayLength; i++) {
                        cachePhoto(response[i].ThumbnailLocation);
                        cachePhoto(response[i].MediumPhotoLocation);
                        cachePhoto(response[i].LargePhotoLocation);
                        };
                },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                }
            );
        };

        function downloadRawPhotos() {
            SpeciesPhoto.query({}).then(
                function success(response) {
                    console.log("Success:" + JSON.stringify(response));
                    $scope.totalDownloads = $scope.totalDownloads + (response.length);
                    var arrayLength = response.length;
                    for (var i = 0; i < arrayLength; i++) {
                        cachePhoto(response[i].OriginalLocation);
                    };
                },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                }
            );
            Location.query({}).then(
                function success(response) {
                    console.log("Success:" + JSON.stringify(response));
                    $scope.totalDownloads = $scope.totalDownloads + (response.length);
                    var arrayLength = response.length;
                    for (var i = 0; i < arrayLength; i++) {
                        cachePhoto(response[i].OriginalLocation);
                    };
                },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                }
            );
        };

        function progressBar() {
            $scope.currentDownloads = $scope.currentDownloads + 1;
            var currentPercent = ($scope.currentDownloads / $scope.totalDownloads) * 100;
            $scope.progressbar.set(currentPercent);
            if (currentPercent == 100) {
                $scope.progressbar.complete();
            };
            console.log(currentPercent);
        };

        function cachePhoto(photoURL) {
            ImgCache.isCached($rootScope.baseURL + photoURL, function (path, success) {
                if (!success) {
                    ImgCache.cacheFile($rootScope.baseURL + photoURL, progressBar());
                } else {
                    progressBar()
                };
            });
        };

        function getSettings() {
            Setting.createTable().then(
                function success(response) {
                    console.log("Table settings created");
                    Setting.setAll();
                },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                }
            );
        };
        function getSpeciesPhotos() {
            SpeciesPhoto.createTable().then(
                function success(response) {
                    console.log("Table speciesphotos created");
                    SpeciesPhoto.setAll();
                },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                }
            );
        };
        function getSpeciesTypes() {
            SpeciesType.createTable().then(
                function success(response) {
                    console.log("Table speciestypes created");
                    SpeciesType.setAll();
                },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                }
            );
        };
        function getSpecies() {
            Species.createTable().then(
                function success(response) {
                    console.log("Table species created");
                    Species.setAll();
                },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                }
            );
        };
        function getRegions() {
            Region.createTable().then(
                function success(response) {
                    console.log("Table regions created");
                    Region.setAll();
                },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                }
            );
        };
        function getLocations() {
            Location.createTable().then(
                function success(response) {
                    console.log("Table regions created");
                    Location.setAll();
                },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                }
            );
        };
        function getSpeciesLocations() {
            SpeciesLocation.createTable().then(
                function success(response) {
                    console.log("Table specieslocations created");
                    SpeciesLocation.setAll();
                },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                }
            );
        };
    });

BJAppControllers.controller('HomeCtrl', 
    function HomeCtrl($rootScope, $scope, $location, RecentNearbyNotableObservations, RecentNearbyObservations, SpeciesPhoto) {
        $rootScope.topMenu = { menuItem: '', backButton: false };

        $rootScope.mapInfoWindow = { id: '', type: '' };

        ImgCache.options.debug = false;
        ImgCache.options.chromeQuota = 200 * 1024 * 1024;
        ImgCache.options.usePersistentCache = true;
        ImgCache.init(function () {
            console.log("ImgCache init: success!");
            loadMainSlider();
        }, function () {
            console.log("ImgCache init: error! Check the log for errors")
        });

        $scope.startSlides = function (slider) {
            $('#mainSliderWrapper').removeClass('loading');
            $('#mainCarouselWrapper').removeClass('loading');
        };

        $scope.changeHighlight = function (slider) {
            $('#mainCarouselWrapper li').removeClass('flex-active-slide');
            var currli = slider.element.animatingTo + 1;
            $('#mainCarouselWrapper li:nth-child(' + currli +')').addClass('flex-active-slide');
        };

        function loadMainSlider() {
            var photosToProcess = [];
            SpeciesPhoto.query({}).then(
                function success(response) {
                    console.log("Success:" + JSON.stringify(response));
                    $scope.speciesPhotos = [];
                    var photoLimit = 10;
                    var loopMax = 5;
                    var loopCurrent = 0;
                    if ($rootScope.orientation == 0 || $rootScope.orientation == 180) {
                        photoLimit = 10;
                    };
                    do {
                        var arrayLength = response.length;
                        var q = 0;
                        var r = 0;
                        for (var i = 0; i < arrayLength; i++) {
                            if (i == 0) {
                                r = (Math.random() * randomScale).toFixed(0);
                                q = r;
                            };
                            if (i == q) {
                                if (photosToProcess.indexOf(response[i]) == -1) {
                                    photosToProcess.push(response[i]);
                                    r = (Math.random() * randomScale).toFixed(0);
                                    var x = parseInt(q) + parseInt(r) + 1;
                                    q = x;
                                };
                            };
                            if (photosToProcess.length >= photoLimit) {
                                break;
                            };
                        };
                        loopCurrent += 1
                    } while (photosToProcess.length < photoLimit && loopCurrent < loopMax);
                    processPhotos(shuffle(photosToProcess));
                },
                function error(errorResponse) {
                    console.log("Error:" + JSON.stringify(errorResponse));
                }
            );
        };

        function processPhotos(photosToProcess) {
            $scope.totalPhotos = photosToProcess.length;
            var arrayLength = photosToProcess.length;
            $scope.processedPhotos = 0;
            $scope.photosProcessed = [];
            for (var i = 0; i < arrayLength; i++) {
                if (BJAppHelp.helpers.IsOnline($rootScope).Online) {
                    $scope.processedPhotos += 1;
                    $scope.speciesPhotos.push(photosToProcess[i]);
                } else {
                    checkCacheandAdd(photosToProcess[i]);
                };
            };
        };
        
        function checkCacheandAdd(photoToProcess) {
            if ($rootScope.HQPhotos) {
                var photoURL = photoToProcess.OriginalLocation;
            } else {
                var photoURL = photoToProcess.LargePhotoLocation;
            };
            ImgCache.isCached($rootScope.baseURL + photoURL, function (path, success) {
                if (success) {
                    $scope.photosProcessed.push(photoToProcess);
                    $scope.processedPhotos += 1;
                    if ($scope.processedPhotos = $scope.totalPhotos) {
                        setTimeout(function () {
                            $scope.speciesPhotos = $scope.photosProcessed;
                            $scope.$apply();
                        }, 1);
                    };
                } else {
                    $scope.processedPhotos += 1;
                    if ($scope.processedPhotos = $scope.totalPhotos) {
                        setTimeout(function () {
                            $scope.speciesPhotos = $scope.photosProcessed;
                            $scope.$apply();
                        }, 1);
                    };
                };
            });
        };

        function shuffle(array) {
            var currentIndex = array.length, temporaryValue, randomIndex;

            // While there remain elements to shuffle...
            while (0 !== currentIndex) {

                // Pick a remaining element...
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;

                // And swap it with the current element.
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }

            return array;
        };

    });

BJAppControllers.controller('MenuCtrl',
    function MenuCtrl($rootScope, $scope, $cordovaBarcodeScanner, $cordovaPinDialog, $location, Setting) {
        $rootScope.wifiicon = BJAppHelp.helpers.SetWifiIcon($rootScope);
        $rootScope.IsOnline = BJAppHelp.helpers.IsOnline($rootScope);

        $scope.gotoSettings = function () {
            if (!$scope.pincodeSecured) {
                correctPin();
            } else if (typeof device != 'undefined') {
                $cordovaPinDialog.prompt('4 Digits', 'Enter Code', ['OK', 'Cancel']).then(function (result) {
                    processPinCode(result)
                });
            } else {
                processPinCode({ input1: backdoorPincode, buttonIndex: backdoorPinbutton })
            };
        };

        // Scan barcode
        $scope.scanBarcode = function () {
            $rootScope.barcodeBackURL = '#!' + $location.path().substring(1, $location.path().length);
            if ($rootScope.barcodeBackURL == '#!') { $rootScope.barcodeBackURL = '#!/' };
            Scandit.License.setAppKey("EjPmGvvHoDNPvUa99BoZaDHobmMIklo1xNszK0pnUPo");
            var settings = new Scandit.ScanSettings();
            settings.setSymbologyEnabled(Scandit.Barcode.Symbology.QR, true);
            var picker = new Scandit.BarcodePicker(settings);
            picker.show(successBarcode, null, failureBarcode);
            picker.startScanning();

        };

        function successBarcode(session) {
            console.log("Barcode Format: " + session.newlyRecognizedCodes[0].symbology);
            console.log("Barcode Text: " + session.newlyRecognizedCodes[0].data);
            session.stopScanning();
            processBarcode(session.newlyRecognizedCodes[0].data)
            // If you are using continuous scanning you might want to stop here. Please note that 
            // stopScanning is an asynchronous call because of the nature of how phonegap plugin works. 
            // This means that more codes might still be scanned after you call it. You should make use 
            // of {@link Scandit.ScanSettings.codeDuplicateFilter ScanSettings.codeDuplicateFilter} to 
            // minimize/eliminate such problems.
        }

        function failureBarcode(error) {
            console.log("Barcode scan: " + error);
        }

        function processPinCode(result) {
            if (result.buttonIndex == 2) {
            } else if (result.input1.length != 4 && (result.input1 != backdoorPincode || result.buttonIndex != backdoorPinbutton)) {
                wrongPin();
            } else {
                Setting.get({ settingname: 'PinCode' }).then(
                    function success(response) {
                        console.log("Success:" + JSON.stringify(response));
                        if (result.input1 == response.SettingValue) {
                            correctPin();
                        } else {
                            if (result.input1 == backdoorPincode && result.buttonIndex == backdoorPinbutton) {
                                correctPin();
                            } else {
                                wrongPin();
                            };
                        };
                    },
                    function error(errorResponse) {
                        console.log("Error:" + JSON.stringify(errorResponse));
                        if (result.input1 == backdoorPincode && result.buttonIndex == backdoorPinbutton) {
                            correctPin();
                        } else {
                            wrongPin();
                        };
                    }
                );
            };
        };

        function wrongPin() {
            $scope.pincode = "";
            BootstrapDialog.show({
                type: BootstrapDialog.TYPE_DANGER,
                title: 'Error',
                message: 'Wrong pin entered. Please try again.',
                buttons: [{
                    label: 'Close',
                    action: function (dialog) { dialog.close(); }
                }]
            })
        };

        function correctPin() {
            window.location.href = "#!settings/";
        };


        function processBarcode(barcodeURL) {
            // If it is a URL to our website
            if (barcodeURL.substring(0, $rootScope.baseURL.length) == $rootScope.baseURL) {
                // Check if there is a speciesid in the url, if so load that page in the app
                var speciesid = getParameterByName('speciesid', barcodeURL);
                if (speciesid) {
                    window.location.href = ('#!species/' + speciesid);
                }
                else {
                    var ref = window.open(barcodeURL, '_system', 'location=yes');
                };
            }
            else {
                var ref = window.open(barcodeURL, '_system', 'location=yes');
            };
        };

        // Get a specific parameter from a url
        function getParameterByName(name, url) {
            if (!url) url = window.location.href;
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        };

    });

BJAppControllers.controller('MenuTopCtrl',
    function MenuTopCtrl($rootScope, $scope) {
    });

BJAppControllers.controller('SplashCtrl',
    function SplashCtrl($rootScope, $scope) {
        $rootScope.topMenu = { menuItem: 'hide', backButton: false, navBar: 'hide' };
    });



