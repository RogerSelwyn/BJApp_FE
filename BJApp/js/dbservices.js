'use strict'

var DBServices = angular.module('DBServices', ['ngResource']);

DBServices.factory('Setting', 
    function ($q, $rootScope, cacheSetting, webSetting) {
        return {
            get: function get(params) {
                var deferred = $q.defer();
                if (BJAppHelp.helpers.IsOnline($rootScope).Online) {
                    webSetting.get(params,
                        function success(response) {
                            deferred.resolve(response);
                        },
                        function error(errorResponse) {
                            deferred.reject(errorResponse);
                        }
                    );
                } else {
                    cacheSetting.get(params).then(
                        function success(response) {
                            deferred.resolve(response);
                        },
                        function error(errorResponse) {
                            deferred.reject(errorResponse);
                        }
                    );
                };
                return deferred.promise;
            },
            setAll: function set(params) {
                webSetting.query(params,
                    function success(response) {
                        cacheSetting.setAll(response);
                    },
                    function error(errorResponse) {
                    }
                );
            },
            createTable: function createTable() {
                var deferred = $q.defer();
                cacheSetting.createTable().then(
                    function success(response) {
                        deferred.resolve(response);
                    },
                    function error(errorResponse) {
                        deferred.reject(errorResponse);
                    }
                );
                return deferred.promise;
            }
        };
    });

DBServices.factory('SpeciesPhoto',
    function ($q, $rootScope, cacheSpeciesPhoto, webSpeciesPhoto) {
        return {
            get: function get(params) {
                var deferred = $q.defer();
                if (BJAppHelp.helpers.IsOnline($rootScope).Online) {
                    webSpeciesPhoto.get(params,
                        function success(response) {
                            deferred.resolve(response);
                        },
                        function error(errorResponse) {
                            deferred.reject(errorResponse);
                        }
                    );
                } else {
                    cacheSpeciesPhoto.get(params).then(
                        function success(response) {
                            deferred.resolve(response);
                        },
                        function error(errorResponse) {
                            deferred.reject(errorResponse);
                        }
                    );
                };
                return deferred.promise;
            },
            query: function query(params) {
                var deferred = $q.defer();
                if (BJAppHelp.helpers.IsOnline($rootScope).Online) {
                    webSpeciesPhoto.query(params,
                        function success(response) {
                            deferred.resolve(response);
                        },
                        function error(errorResponse) {
                            deferred.reject(errorResponse);
                        }
                    );
                } else {
                    cacheSpeciesPhoto.query(params).then(
                        function success(response) {
                            deferred.resolve(response);
                        },
                        function error(errorResponse) {
                            deferred.reject(errorResponse.message);
                        }
                    );
                };
                return deferred.promise;
            },
            setAll: function set() {
                webSpeciesPhoto.query({},
                    function success(response) {
                        cacheSpeciesPhoto.setAll(response);
                    },
                    function error(errorResponse) {
                    }
                );
            },
            createTable: function createTable() {
                var deferred = $q.defer();
                cacheSpeciesPhoto.createTable().then(
                    function success(response) {
                        deferred.resolve(response);
                    },
                    function error(errorResponse) {
                        deferred.reject(errorResponse);
                    }
                );
                return deferred.promise;
            }
        };
    });

DBServices.factory('SpeciesType',
    function ($q, $rootScope, cacheSpeciesType, webSpeciesType) {
        return {
            get: function get(params) {
                var deferred = $q.defer();
                if (BJAppHelp.helpers.IsOnline($rootScope).Online) {
                    webSpeciesType.get(params,
                        function success(response) {
                            deferred.resolve(response);
                        },
                        function error(errorResponse) {
                            deferred.reject(errorResponse);
                        }
                    );
                } else {
                    cacheSpeciesType.get(params).then(
                        function success(response) {
                            deferred.resolve(response);
                        },
                        function error(errorResponse) {
                            deferred.reject(errorResponse);
                        }
                    );
                };
                return deferred.promise;
            },
            query: function query(params) {
                var deferred = $q.defer();
                if (BJAppHelp.helpers.IsOnline($rootScope).Online) {
                    webSpeciesType.query(params,
                        function success(response) {
                            deferred.resolve(response);
                        },
                        function error(errorResponse) {
                            deferred.reject(errorResponse);
                        }
                    );
                } else {
                    cacheSpeciesType.query(params).then(
                        function success(response) {
                            deferred.resolve(response);
                        },
                        function error(errorResponse) {
                            deferred.reject(errorResponse.message);
                        }
                    );
                };
                return deferred.promise;
            },
            setAll: function set(params) {
                webSpeciesType.query(params,
                    function success(response) {
                        cacheSpeciesType.setAll(response);
                    },
                    function error(errorResponse) {
                    }
                );
            },
            createTable: function createTable() {
                var deferred = $q.defer();
                cacheSpeciesType.createTable().then(
                    function success(response) {
                        deferred.resolve(response);
                    },
                    function error(errorResponse) {
                        deferred.reject(errorResponse);
                    }
                );
                return deferred.promise;
            }
        };
    });

DBServices.factory('Species',
    function ($q, $rootScope, cacheSpecies, webSpecies) {
        return {
            get: function get(params) {
                var deferred = $q.defer();
                if (BJAppHelp.helpers.IsOnline($rootScope).Online) {
                    webSpecies.get(params,
                        function success(response) {
                            deferred.resolve(response);
                        },
                        function error(errorResponse) {
                            deferred.reject(errorResponse);
                        }
                    );
                } else {
                    cacheSpecies.get(params).then(
                        function success(response) {
                            deferred.resolve(response);
                        },
                        function error(errorResponse) {
                            deferred.reject(errorResponse);
                        }
                    );
                };
                return deferred.promise;
            },
            query: function query(params) {
                var deferred = $q.defer();
                if (BJAppHelp.helpers.IsOnline($rootScope).Online) {
                    webSpecies.query(params,
                        function success(response) {
                            deferred.resolve(response);
                        },
                        function error(errorResponse) {
                            deferred.reject(errorResponse);
                        }
                    );
                } else {
                    cacheSpecies.query(params).then(
                        function success(response) {
                            deferred.resolve(response);
                        },
                        function error(errorResponse) {
                            deferred.reject(errorResponse.message);
                        }
                    );
                };
                return deferred.promise;
            },
            setAll: function set(params) {
                webSpecies.query(params,
                    function success(response) {
                        cacheSpecies.setAll(response);
                    },
                    function error(errorResponse) {
                    }
                );
            },
            createTable: function createTable() {
                var deferred = $q.defer();
                cacheSpecies.createTable().then(
                    function success(response) {
                        deferred.resolve(response);
                    },
                    function error(errorResponse) {
                        deferred.reject(errorResponse);
                    }
                );
                return deferred.promise;
            }
        };
    });

DBServices.factory('Region',
    function ($q, $rootScope, cacheRegion, webRegion) {
        return {
            get: function get(params) {
                var deferred = $q.defer();
                if (BJAppHelp.helpers.IsOnline($rootScope).Online) {
                    webRegion.get(params,
                        function success(response) {
                            deferred.resolve(response);
                        },
                        function error(errorResponse) {
                            deferred.reject(errorResponse);
                        }
                    );
                } else {
                    cacheRegion.get(params).then(
                        function success(response) {
                            deferred.resolve(response);
                        },
                        function error(errorResponse) {
                            deferred.reject(errorResponse);
                        }
                    );
                };
                return deferred.promise;
            },
            query: function query(params) {
                var deferred = $q.defer();
                if (BJAppHelp.helpers.IsOnline($rootScope).Online) {
                    webRegion.query(params,
                        function success(response) {
                            deferred.resolve(response);
                        },
                        function error(errorResponse) {
                            deferred.reject(errorResponse);
                        }
                    );
                } else {
                    cacheRegion.query(params).then(
                        function success(response) {
                            deferred.resolve(response);
                        },
                        function error(errorResponse) {
                            deferred.reject(errorResponse.message);
                        }
                    );
                };
                return deferred.promise;
            },
            setAll: function set(params) {
                webRegion.query(params,
                    function success(response) {
                        cacheRegion.setAll(response);
                    },
                    function error(errorResponse) {
                    }
                );
            },
            createTable: function createTable() {
                var deferred = $q.defer();
                cacheRegion.createTable().then(
                    function success(response) {
                        deferred.resolve(response);
                    },
                    function error(errorResponse) {
                        deferred.reject(errorResponse);
                    }
                );
                return deferred.promise;
            }
        };
    });

DBServices.factory('Location',
    function ($q, $rootScope, cacheLocation, webLocation) {
        return {
            get: function get(params) {
                var deferred = $q.defer();
                if (BJAppHelp.helpers.IsOnline($rootScope).Online) {
                    webLocation.get(params,
                        function success(response) {
                            deferred.resolve(response);
                        },
                        function error(errorResponse) {
                            deferred.reject(errorResponse);
                        }
                    );
                } else {
                    cacheLocation.get(params).then(
                        function success(response) {
                            deferred.resolve(response);
                        },
                        function error(errorResponse) {
                            deferred.reject(errorResponse);
                        }
                    );
                };
                return deferred.promise;
            },
            query: function query(params) {
                var deferred = $q.defer();
                if (BJAppHelp.helpers.IsOnline($rootScope).Online) {
                    webLocation.query(params,
                        function success(response) {
                            deferred.resolve(response);
                        },
                        function error(errorResponse) {
                            deferred.reject(errorResponse);
                        }
                    );
                } else {
                    cacheLocation.query(params).then(
                        function success(response) {
                            deferred.resolve(response);
                        },
                        function error(errorResponse) {
                            deferred.reject(errorResponse.message);
                        }
                    );
                };
                return deferred.promise;
            },
            setAll: function set(params) {
                webLocation.query(params,
                    function success(response) {
                        cacheLocation.setAll(response);
                    },
                    function error(errorResponse) {
                    }
                );
            },
            createTable: function createTable() {
                var deferred = $q.defer();
                cacheLocation.createTable().then(
                    function success(response) {
                        deferred.resolve(response);
                    },
                    function error(errorResponse) {
                        deferred.reject(errorResponse);
                    }
                );
                return deferred.promise;
            }
        };
    });

DBServices.factory('SpeciesLocation',
    function ($q, $rootScope, cacheSpeciesLocation, webSpeciesLocation) {
        return {
            get: function get(params) {
                var deferred = $q.defer();
                if (BJAppHelp.helpers.IsOnline($rootScope).Online) {
                    webSpeciesLocation.get(params,
                        function success(response) {
                            deferred.resolve(response);
                        },
                        function error(errorResponse) {
                            deferred.reject(errorResponse);
                        }
                    );
                } else {
                    cacheSpeciesLocation.get(params).then(
                        function success(response) {
                            deferred.resolve(response);
                        },
                        function error(errorResponse) {
                            deferred.reject(errorResponse);
                        }
                    );
                };
                return deferred.promise;
            },
            query: function query(params) {
                var deferred = $q.defer();
                if (BJAppHelp.helpers.IsOnline($rootScope).Online) {
                    webSpeciesLocation.query(params,
                        function success(response) {
                            deferred.resolve(response);
                        },
                        function error(errorResponse) {
                            deferred.reject(errorResponse);
                        }
                    );
                } else {
                    cacheSpeciesLocation.query(params).then(
                        function success(response) {
                            deferred.resolve(response);
                        },
                        function error(errorResponse) {
                            deferred.reject(errorResponse.message);
                        }
                    );
                };
                return deferred.promise;
            },
            setAll: function set(params) {
                webSpeciesLocation.query(params,
                    function success(response) {
                        cacheSpeciesLocation.setAll(response);
                    },
                    function error(errorResponse) {
                    }
                );
            },
            createTable: function createTable() {
                var deferred = $q.defer();
                cacheSpeciesLocation.createTable().then(
                    function success(response) {
                        deferred.resolve(response);
                    },
                    function error(errorResponse) {
                        deferred.reject(errorResponse);
                    }
                );
                return deferred.promise;
            }
        };
    });

DBServices.factory('PostcodeSearch',
    function ($q, $rootScope, cachePostcodeSearch, webPostcodeSearch) {
        return {
            get: function get(params) {
                var deferred = $q.defer();
                if (BJAppHelp.helpers.IsOnline($rootScope).Online) {
                    webPostcodeSearch.get(params,
                        function success(response) {
                            deferred.resolve(response);
                        },
                        function error(errorResponse) {
                            deferred.reject(errorResponse);
                        }
                    );
                } else {
                    cachePostcodeSearch.get(params).then(
                        function success(response) {
                            deferred.resolve(response);
                        },
                        function error(errorResponse) {
                            deferred.reject(errorResponse);
                        }
                    );
                };
                return deferred.promise;
            },
            query: function query(params) {
                var deferred = $q.defer();
                if (BJAppHelp.helpers.IsOnline($rootScope).Online) {
                    webPostcodeSearch.query(params,
                        function success(response) {
                            deferred.resolve(response);
                        },
                        function error(errorResponse) {
                            deferred.reject(errorResponse);
                        }
                    );
                } else {
                    cachePostcodeSearch.query(params).then(
                        function success(response) {
                            deferred.resolve(response);
                        },
                        function error(errorResponse) {
                            deferred.reject(errorResponse.message);
                        }
                    );
                };
                return deferred.promise;
            }
        };
    });

