'use strict'

var cacheDBServices = angular.module('cacheDBServices', ['ngResource']);

cacheDBServices.factory('cacheSetting',
    function ($q, $cordovaSQLite) {
        return {
            get: function get(params) {
                var deferred = $q.defer();
                $cordovaSQLite.execute(db, "Select id, SettingName, SettingValue from settings where SettingName = '" + params.settingname + "'").then(function (res) {
                    if (res.rows.length > 0) {
                        var result = res.rows.item(0);
                        deferred.resolve(result);
                    } else {
                        deferred.reject("No data");
                    };
                }, function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            },
            setAll: function setAll(rows) {
                var query = "INSERT INTO settings (id, SettingName, SettingValue) VALUES ";
                var data = [];
                var rowArgs = [];
                rows.forEach(function (row) {
                    rowArgs.push("(?,?,?)");
                    data.push(row.id);
                    data.push(row.SettingName);
                    data.push(row.SettingValue);
                });
                query += rowArgs.join(", ");
                $cordovaSQLite.execute(db, query, data).then(function (res) {
                    console.log("Inserted: " + res.rowsAffected + " Settings");
                }, function (err) {
                    console.error(err.message);
                });
            },
            createTable: function createTable() {
                var deferred = $q.defer();
                $cordovaSQLite.execute(db, "DROP TABLE IF EXISTS settings").then(function (res) {
                    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS settings (id integer primary key, SettingName char(50), SettingValue longtext)").then(function (res) {
                        deferred.resolve(res);
                    }, function (err) {
                        deferred.reject(err);
                    });
                }, function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            }
        };
    });

cacheDBServices.factory('cacheSpeciesPhoto',
    function ($q, $cordovaSQLite) {
        return {
            get: function get(params) {
                var deferred = $q.defer();
                $cordovaSQLite.execute(db, "Select id, SpeciesId, ThumbnailLocation, MediumPhotoLocation, LargePhotoLocation, OriginalLocation, IsDefault, Description from speciesphotos where id = '" + params.id + "'").then(function (res) {
                    if (res.rows.length > 0) {
                        var result = res.rows.item(0);
                        deferred.resolve(result);
                    } else {
                        deferred.resolve(false);
                    };
                }, function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            },
            query: function get(params) {
                var deferred = $q.defer();
                $cordovaSQLite.execute(db, "Select id, SpeciesId, ThumbnailLocation, MediumPhotoLocation, LargePhotoLocation, OriginalLocation, IsDefault, Description from speciesphotos").then(
                    function (res) {
                    if (res.rows.length > 0) {
                        var result = [];
                        for (var i = 0; i < res.rows.length; i++) {
                            result.push(res.rows.item(i));
                        };
                        deferred.resolve(result);
                    } else {
                        deferred.resolve(false);
                    };
                }, function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            },
            setAll: function setAll(rows) {
                var query = "INSERT INTO speciesphotos (id, SpeciesId, ThumbnailLocation, MediumPhotoLocation, LargePhotoLocation, OriginalLocation, IsDefault, Description) VALUES ";
                var data = [];
                var rowArgs = [];
                rows.forEach(function (row) {
                    rowArgs.push("(?,?,?,?,?,?,?,?)");
                    data.push(row.id);
                    data.push(row.SpeciesId);
                    data.push(row.ThumbnailLocation);
                    data.push(row.MediumPhotoLocation);
                    data.push(row.LargePhotoLocation);
                    data.push(row.OriginalLocation);
                    data.push(row.IsDefault);
                    data.push(row.Description);
                });
                query += rowArgs.join(", ");
                $cordovaSQLite.execute(db, query, data).then(function (res) {
                    console.log("Inserted: " + res.rowsAffected + " SpeciesPhotos");
                }, function (err) {
                    console.error(err.message);
                });
            },
            createTable: function createTable() {
                var deferred = $q.defer();
                $cordovaSQLite.execute(db, "DROP TABLE IF EXISTS speciesphotos").then(function (res) {
                    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS speciesphotos (id integer primary key, SpeciesId integer, ThumbnailLocation char(200), MediumPhotoLocation char(200), LargePhotoLocation char(200), OriginalLocation char(200), IsDefault tinyint, Description longtext)").then(function (res) {
                        deferred.resolve(res);
                    }, function (err) {
                        deferred.reject(err);
                    });
                }, function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            }
        };
    });

cacheDBServices.factory('cacheSpeciesType',
    function ($q, $cordovaSQLite) {
        return {
            get: function get(params) {
                var deferred = $q.defer();
                $cordovaSQLite.execute(db, "Select species.id as id, CommonName, LatinName, AliasName, Gender, Colouring, MigratoryPattern, species.Description as Description, LocationDescription, SpecialistInformation, ThumbnailLocation, MediumPhotoLocation, LargePhotoLocation from species INNER JOIN speciesphotos ON species.id = speciesphotos.SpeciesId where species.SpeciesTypeId = '" + params.id + "' and speciesphotos.IsDefault = 1  order by CommonName").then(
                function (res) {
                    var speciesresult = [];
                    for (var i = 0; i < res.rows.length; i++) {
                        speciesresult.push(res.rows.item(i));
                    };
                    var result = { id: params.id, species: speciesresult };
                    deferred.resolve(result);
                }, function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            },
            query: function get(params) {
                var deferred = $q.defer();
                $cordovaSQLite.execute(db, "Select id, SpeciesTypeName from speciesTypes").then(function (res) {
                    if (res.rows.length > 0) {
                        var result = [];
                        for (var i = 0; i < res.rows.length; i++) {
                            result.push(res.rows.item(i));
                        };
                        deferred.resolve(result);
                    } else {
                        deferred.resolve(false);
                    };
                }, function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            },
            setAll: function setAll(rows) {
                var query = "INSERT INTO speciestypes (id, SpeciesTypeName) VALUES ";
                var data = [];
                var rowArgs = [];
                rows.forEach(function (row) {
                    rowArgs.push("(?,?)");
                    data.push(row.id);
                    data.push(row.SpeciesTypeName);
                });
                query += rowArgs.join(", ");
                $cordovaSQLite.execute(db, query, data).then(function (res) {
                    console.log("Inserted: " + res.rowsAffected + " SpeciesTypes");
                }, function (err) {
                    console.error(err.message);
                });
            },
            createTable: function createTable() {
                var deferred = $q.defer();
                $cordovaSQLite.execute(db, "DROP TABLE IF EXISTS speciestypes").then(function (res) {
                    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS speciestypes (id integer primary key, SpeciesTypeName char(50))").then(function (res) {
                        deferred.resolve(res);
                    }, function (err) {
                        deferred.reject(err);
                    });
                }, function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            }
        };
    });

cacheDBServices.factory('cacheSpecies',
    function ($q, $cordovaSQLite) {
        return {
            get: function get(params) {
                var deferred = $q.defer();
                $cordovaSQLite.execute(db, "Select id, SpeciesTypeId, CommonName, LatinName, AliasName, Gender, Colouring, MigratoryPattern, Description, LocationDescription, SpecialistInformation from species where id = '" + params.id + "'" ).then(function (res) {
                    if (res.rows.length > 0) {
                        var speciesResult = res.rows.item(0);
                        var regionsResult = [];
                        var speciesPhotosResult = [];
                        $cordovaSQLite.execute(db, "Select id, SpeciesId, ThumbnailLocation, MediumPhotoLocation, LargePhotoLocation, IsDefault, Description, OriginalLocation from speciesphotos where SpeciesId = '" +params.id + "' order by IsDefault desc").then(function (res2) {
                            for (var j = 0; j < res2.rows.length; j++) {
                                speciesPhotosResult.push(res2.rows.item(j));
                            };
                            $cordovaSQLite.execute(db, "SELECT regions.id as RegionId, RegionName, locations.id as LocationId, LocationName, Address, County, Postcode, Country, Description, Latitude, Longitude, ThumbnailLocation, MediumPhotoLocation, LargePhotoLocation FROM specieslocations LEFT JOIN locations ON specieslocations.LocationId = locations.id LEFT JOIN regions ON locations.RegionId = regions.id WHERE SpeciesId = '" + params.id + "'").then(function (res3) {
                                if (res3.rows.length > 0) {
                                    var curRegionId = res3.rows.item(0).RegionId;
                                    var curRegionName = res3.rows.item(0).RegionName;
                                    var locationsResult = [];
                                    for (var k = 0; k < res3.rows.length; k++) {
                                        if (res3.rows.item(k).RegionId != curRegionId) {
                                            regionsResult.push({ id: curRegionId, RegionName: curRegionName, locations: locationsResult });
                                            locationsResult = [];
                                            curRegionId = res3.rows.item(k).RegionId;
                                            curRegionName = res3.rows.item(k).RegionName;
                                        };
                                        locationsResult.push({
                                            id: res3.rows.item(k).LocationId,
                                            LocationName: res3.rows.item(k).LocationName,
                                            Address: res3.rows.item(k).Address,
                                            County: res3.rows.item(k).County,
                                            Postcode: res3.rows.item(k).Postcode,
                                            Country: res3.rows.item(k).Country,
                                            Description: res3.rows.item(k).Description,
                                            Latitude: res3.rows.item(k).Latitude,
                                            Longitude: res3.rows.item(k).Longitude,
                                            ThumbnailLocation: res3.rows.item(k).ThumbnailLocation,
                                            MediumPhotoLocation: res3.rows.item(k).MediumPhotoLocation,
                                            LargePhotoLocation: res3.rows.item(k).LargePhotoLocation,
                                            OriginalLocation: res3.rows.item(k).OriginalLocation
                                        })
                                    };
                                    regionsResult.push({ id: curRegionId, RegionName: curRegionName, locations: locationsResult });
                                }
                                var result = {
                                    id: speciesResult.id,
                                    SpeciesTypeId: speciesResult.SpeciesTypeId,
                                    CommonName: speciesResult.CommonName,
                                    LatinName: speciesResult.LatinName,
                                    AliasName: speciesResult.AliasName,
                                    Gender: speciesResult.Gender,
                                    Colouring: speciesResult.Colouring,
                                    MigratoryPattern: speciesResult.MigratoryPattern,
                                    Description: speciesResult.Description,
                                    LocationDescription: speciesResult.LocationDescription,
                                    SpecialistInformation: speciesResult.SpecialistInformation,
                                    regions: regionsResult,
                                    speciesphotos: speciesPhotosResult,
                                };
                                deferred.resolve(result);
                            }, function (err3) {
                                deferred.reject(err3.message);
                            });
                        }, function (err2) {
                            deferred.reject(err2.message);
                        });
                    } else {
                        deferred.resolve(false);
                    };
                }, function (err) {
                    deferred.reject(err.message);
                });
                return deferred.promise;
            },
            query: function get(params) {
                var deferred = $q.defer();
                $cordovaSQLite.execute(db, "Select id, SpeciesTypeId, CommonName, LatinName, AliasName, Gender, Colouring, MigratoryPattern, Description, LocationDescription, SpecialistInformation from species").then(function (res) {
                    if (res.rows.length > 0) {
                        var result = [];
                        for (var i = 0; i < res.rows.length; i++) {
                            result.push(res.rows.item(i));
                        };
                        deferred.resolve(result);
                    } else {
                        deferred.resolve(false);
                    };
                }, function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            },
            setAll: function setAll(rows) {
                var query = "INSERT INTO species (id, SpeciesTypeId, CommonName, LatinName, AliasName, Gender, Colouring, MigratoryPattern, Description, LocationDescription, SpecialistInformation) VALUES ";
                var data = [];
                var rowArgs = [];
                rows.forEach(function (row) {
                    rowArgs.push("(?,?,?,?,?,?,?,?,?,?,?)");
                    data.push(row.id);
                    data.push(row.SpeciesTypeId);
                    data.push(row.CommonName);
                    data.push(row.LatinName);
                    data.push(row.AliasName);
                    data.push(row.Gender);
                    data.push(row.Colouring);
                    data.push(row.MigratoryPattern);
                    data.push(row.Description);
                    data.push(row.LocationDescription);
                    data.push(row.SpecialistInformation);
                });
                query += rowArgs.join(", ");
                $cordovaSQLite.execute(db, query, data).then(function (res) {
                    console.log("Inserted: " + res.rowsAffected + " Species");
                }, function (err) {
                    console.error(err.message);
                });
            },
            createTable: function createTable() {
                var deferred = $q.defer();
                $cordovaSQLite.execute(db, "DROP TABLE IF EXISTS species").then(function (res) {
                    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS species (id integer primary key, SpeciesTypeId integer, CommonName char(50), LatinName char(50), AliasName char(50), Gender char(50), Colouring char(50), MigratoryPattern longtext, Description longtext, LocationDescription longtext, SpecialistInformation longtext )").then(function (res) {
                        deferred.resolve(res);
                    }, function (err) {
                        deferred.reject(err);
                    });
                }, function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            }
        };
    });

cacheDBServices.factory('cacheRegion',
    function ($q, $cordovaSQLite) {
        return {
            get: function get(params) {
                var deferred = $q.defer();
                $cordovaSQLite.execute(db, "Select id, RegionName from regions where id = '" + params.id + "'").then(function (res) {
                    if (res.rows.length > 0) {
                        var result = res.rows.item(0);
                        deferred.resolve(result);
                    } else {
                        deferred.resolve(false);
                    };
                }, function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            },
            query: function get(params) {
                var deferred = $q.defer();
                $cordovaSQLite.execute(db, "Select id, RegionName from regions").then(function (res) {
                    if (res.rows.length > 0) {
                        var result = [];
                        for (var i = 0; i < res.rows.length; i++) {
                            result.push(res.rows.item(i));
                        };
                        deferred.resolve(result);
                    } else {
                        deferred.resolve(false);
                    };
                }, function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            },
            setAll: function setAll(rows) {
                var query = "INSERT INTO regions (id, RegionName) VALUES ";
                var data = [];
                var rowArgs = [];
                rows.forEach(function (row) {
                    rowArgs.push("(?,?)");
                    data.push(row.id);
                    data.push(row.RegionName);
                });
                query += rowArgs.join(", ");
                $cordovaSQLite.execute(db, query, data).then(function (res) {
                    console.log("Inserted: " + res.rowsAffected + " Regions");
                }, function (err) {
                    console.error(err.message);
                });
            },
            createTable: function createTable() {
                var deferred = $q.defer();
                $cordovaSQLite.execute(db, "DROP TABLE IF EXISTS regions").then(function (res) {
                    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS regions (id integer primary key, RegionName char(50))").then(function (res) {
                        deferred.resolve(res);
                    }, function (err) {
                        deferred.reject(err);
                    });
                }, function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            }
        };
    });

cacheDBServices.factory('cacheLocation', 
    function ($q, $cordovaSQLite) {
        return {
            get: function get(params) {
                var deferred = $q.defer();
                $cordovaSQLite.execute(db, "Select id, RegionId, LocationName, Address, County, Postcode, Country, Description, Latitude, Longitude, ThumbnailLocation, MediumPhotoLocation, LargePhotoLocation, OriginalLocation from locations where id = '" +params.id + "'").then(function (res) {
                    if (res.rows.length > 0) {
                        var locationResult = res.rows.item(0);
                        $cordovaSQLite.execute(db, "Select species.id as id, CommonName, LatinName, AliasName, Gender, Colouring, MigratoryPattern, species.Description as Description, LocationDescription, SpecialistInformation, ThumbnailLocation, MediumPhotoLocation, LargePhotoLocation FROM specieslocations INNER JOIN (species INNER JOIN speciesphotos ON species.id = speciesphotos.SpeciesId) ON specieslocations.SpeciesId = species.id WHERE speciesphotos.IsDefault= 1 AND specieslocations.LocationId='" +params.id + "' order by CommonName").then(
                        function (res2) {
                            var speciesResult = [];
                            for (var i = 0; i < res2.rows.length; i++) {
                                speciesResult.push(res2.rows.item(i));
                            };
                            var result = {
                                id: locationResult.id,
                                RegionId: locationResult.RegionId,
                                LocationName: locationResult.LocationName,
                                Address: locationResult.Address,
                                County: locationResult.County,
                                Postcode: locationResult.Postcode,
                                Country: locationResult.Country,
                                Description: locationResult.Description,
                                Latitude: locationResult.Latitude,
                                Longitude: locationResult.Longitude,
                                ThumbnailLocation: locationResult.ThumbnailLocation,
                                MediumPhotoLocation: locationResult.MediumPhotoLocation,
                                LargePhotoLocation: locationResult.LargePhotoLocation,
                                OriginalLocation: locationResult.OriginalLocation,
                                species: speciesResult
                            };
                            deferred.resolve(result);
                        }, function (err2) {
                            deferred.reject(err2);
                        });
                    } else {
                        deferred.resolve(false);
                    };
                }, function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            },
            query: function get(params) {
                var deferred = $q.defer();
                $cordovaSQLite.execute(db, "Select id, RegionId, LocationName, Address, County, Postcode, Country, Description, Latitude, Longitude, ThumbnailLocation, MediumPhotoLocation, LargePhotoLocation, OriginalLocation from locations order by LocationName").then(function (res) {
                    if (res.rows.length > 0) {
                        var result = [];
                        for (var i = 0; i < res.rows.length; i++) {
                            result.push(res.rows.item(i));
                        };
                        deferred.resolve(result);
                    } else {
                        deferred.resolve(false);
                    };
                }, function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            },
            setAll: function setAll(rows) {
                var query = "INSERT INTO locations (id, RegionId, LocationName, Address, County, Postcode, Country, Description, Latitude, Longitude, ThumbnailLocation,MediumPhotoLocation, LargePhotoLocation, OriginalLocation) VALUES ";
                var data = [];
                var rowArgs = [];
                rows.forEach(function (row) {
                    rowArgs.push("(?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
                    data.push(row.id);
                    data.push(row.RegionId);
                    data.push(row.LocationName);
                    data.push(row.Address);
                    data.push(row.County);
                    data.push(row.Postcode);
                    data.push(row.Country);
                    data.push(row.Description);
                    data.push(row.Latitude);
                    data.push(row.Longitude);
                    data.push(row.ThumbnailLocation);
                    data.push(row.MediumPhotoLocation);
                    data.push(row.LargePhotoLocation);
                    data.push(row.OriginalLocation);
                });
                query += rowArgs.join(", ");
                $cordovaSQLite.execute(db, query, data).then(function (res) {
                    console.log("Inserted: " + res.rowsAffected + " Locations");
                }, function (err) {
                    console.error(err.message);
                });
            },
            createTable: function createTable() {
                var deferred = $q.defer();
                $cordovaSQLite.execute(db, "DROP TABLE IF EXISTS locations").then(function (res) {
                    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS locations (id integer primary key, RegionId integer, LocationName char(50), Address char(200), County char(50), Postcode char(20), Country char(50), Description longtext, Latitude decimal(10,6), Longitude decimal(10,6), ThumbnailLocation char(200), MediumPhotoLocation char(200), LargePhotoLocation char(200), OriginalLocation char(200))").then(function (res) {
                        deferred.resolve(res);
                    }, function (err) {
                        deferred.reject(err);
                    });
                }, function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            }
        };
    });

cacheDBServices.factory('cacheSpeciesLocation',
    function ($q, $cordovaSQLite) {
        return {
            get: function get(params) {
                var deferred = $q.defer();
                $cordovaSQLite.execute(db, "Select id, SpeciesId, LocationId from specieslocations where id = '" + params.id + "'").then(function (res) {
                    if (res.rows.length > 0) {
                        var result = res.rows.item(0);
                        deferred.resolve(result);
                    } else {
                        deferred.resolve(false);
                    };
                }, function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            },
            query: function get(params) {
                var deferred = $q.defer();
                $cordovaSQLite.execute(db, "Select id, SpeciesId, LocationId from specieslocations").then(function (res) {
                    if (res.rows.length > 0) {
                        var result = [];
                        for (var i = 0; i < res.rows.length; i++) {
                            result.push(res.rows.item(i));
                        };
                        deferred.resolve(result);
                    } else {
                        deferred.resolve(false);
                    };
                }, function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            },
            setAll: function setAll(rows) {
                var query = "INSERT INTO specieslocations (id, SpeciesId, LocationId) VALUES ";
                var data = [];
                var rowArgs = [];
                rows.forEach(function (row) {
                    rowArgs.push("(?,?,?)");
                    data.push(row.id);
                    data.push(row.SpeciesId);
                    data.push(row.LocationId);
                });
                query += rowArgs.join(", ");
                $cordovaSQLite.execute(db, query, data).then(function (res) {
                    console.log("Inserted: " + res.rowsAffected + " SpeciesLocations");
                }, function (err) {
                    console.error(err.message);
                });
            },
            createTable: function createTable() {
                var deferred = $q.defer();
                $cordovaSQLite.execute(db, "DROP TABLE IF EXISTS specieslocations").then(function (res) {
                    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS specieslocations (id integer primary key, SpeciesId integer, LocationId integer)").then(function (res) {
                        deferred.resolve(res);
                    }, function (err) {
                        deferred.reject(err);
                    });
                }, function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            }
        };
    });

cacheDBServices.factory('cachePostcodeSearch',
    function ($q, $cordovaSQLite) {
        return {
            get: function get(params) {
                var deferred = $q.defer();
                $cordovaSQLite.execute(db, "Select id, RegionId, LocationName, Address, County, Postcode, Country, Description, Latitude, Longitude, ThumbnailLocation, MediumPhotoLocation, LargePhotoLocation from locations where Postcode like '%" + params.searchstr + "%'").then(function (res) {
                    if (res.rows.length > 0) {
                        var result = [];
                        for (var i = 0; i < res.rows.length; i++) {
                            result.push(res.rows.item(i));
                        };
                        deferred.resolve(result);
                    } else {
                        deferred.resolve(false);
                    };
                }, function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            },
            query: function get(params) {
                var deferred = $q.defer();
                $cordovaSQLite.execute(db, "Select id, RegionId, LocationName, Address, County, Postcode, Country, Description, Latitude, Longitude, ThumbnailLocation, MediumPhotoLocation, LargePhotoLocation from locations order by LocationName").then(function (res) {
                    if (res.rows.length > 0) {
                        var result = [];
                        for (var i = 0; i < res.rows.length; i++) {
                            result.push(res.rows.item(i));
                        };
                        deferred.resolve(result);
                    } else {
                        deferred.resolve(false);
                    };
                }, function (err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            }
        };
    });
