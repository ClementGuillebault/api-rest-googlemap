angular.module('tripAPI', ['ngMessages']);

angular
    .module('tripAPI')
    .factory('requestFactory', requestFactory)
    .factory('googlemapFactory', googlemapFactory)
    .factory('vehiculesFactory', vehiculesFactory)
    .controller('TripController', TripController);


function googlemapFactory($q, $rootScope) {

    var map;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var directionsService = new google.maps.DirectionsService;
    var geocoder          = new google.maps.Geocoder;

    var googlemap = {
        setDirection: setDirection,
        geocoding: geocoding,
        initMap: initMap,
        map: map
    };

    return googlemap;

    function setDirection(tabDepart, tabArrive, travel) {

        var directionErrorZeroResult = $q.defer();

        var depart = tabDepart.join(', ');
        var arrive = tabArrive.join(', ');

        directionsService.route({
            origin: depart,
            destination: arrive,
            travelMode: 'DRIVING'
        }, function (response, status) {
            if (status === 'OK') {
                directionsDisplay.setDirections(response);
                directionErrorZeroResult.resolve(false);
            }
            else {
                if (status === 'ZERO_RESULTS') {
                    directionErrorZeroResult.resolve(true);
                }
                console.log('error: '+ status);
            }
        });

        return directionErrorZeroResult.promise;
    };

    function geocoding(lat, lng) {

        /* L'adresse formaté des coordonnées */
        var adressFromCoord = $q.defer();

        var latlng = { 
            lat: parseFloat(lat), 
            lng: parseFloat(lng) 
        };
        
        geocoder.geocode({'location': latlng}, function(results, status) {
            if (status === 'OK') {
                if (results[1]) {
                    adressFromCoord.resolve(results[1].formatted_address);
                }
                else {
                    adressFromCoord.resolve('');
                }
            }
            else {
                console.log('Geocoder failed due to: ' + status);
            }
        });

        return adressFromCoord.promise;
    };

    function initMap() {

        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 49.15, lng: -0.32},
            zoom: 8
        });

        directionsDisplay.setMap(map);
        directionsDisplay.setPanel(document.getElementById('googlemappanel'));

        map.addListener('rightclick', function(coord) {
            $rootScope.$broadcast('listen', coord);
        });

    };

}

function requestFactory($http) {
    var request = {
        getRoot: getRoot,
        postNewTrip: postNewTrip,
        deleteTrip: deleteTrip
    };

    return request;

    function getRoot() {
        return $http.get('/api/transports')
            .then(trips)
            .catch(error);
    };

    function postNewTrip(data) {
        return $http.post('/api/transports', data)
            .then(trips)
            .catch(error);
    };

    function deleteTrip(id) {
        return $http.delete('/api/transports/' + id)
            .then(trips)
            .catch(error);
    };

    function trips(response) {
        return response.data._trip.transports;
    }

    function error(response) {
        return 'error ' + response;
    }    
}

function vehiculesFactory() {

    /* Tableau des moyen de locomotion */
    var vehicules = [
        {'name': 'Voiture', 'value': 'DRIVING'},
        {'name': 'A pied', 'value': 'WALKING'},
        {'name': 'En vélo', 'value': 'BICYCLING'},
        {'name': 'Transport en commun', 'value': 'TRANSIT'}
    ];

    return vehicules;    
}

function TripController(googlemapFactory, requestFactory, vehiculesFactory, $rootScope, $scope) {

    var vm       = this;
    var trips    = {};
    vm.form      = {};

    vm.getAccueil = getAccueil;
    vm.addTrip    = addTrip;
    vm.seeTrip    = seeTrip;
    vm.delTrip    = delTrip;
    vm.updNbTrip  = updNbTrip;

    vm.vehicules = vehiculesFactory;

    googlemapFactory.initMap();

    getAccueil();

    $rootScope.$on('listen', function(ev, data) {
        if (vm.captureFrom) {
            vm.form.departLat = parseFloat(data.latLng.lat().toFixed(2));
            vm.form.departLon = parseFloat(data.latLng.lng().toFixed(2));
            vm.captureFrom = false;
        }
        if(vm.captureTo) {
            vm.form.arriveLat = parseFloat(data.latLng.lat().toFixed(2));
            vm.form.arriveLon = parseFloat(data.latLng.lng().toFixed(2));
            vm.captureTo = false;
        };
        $scope.$apply();
    });

    function getAccueil() {
        requestFactory.getRoot().then(function(response) {

            vm.trips = response;
            trips    = response;
            updNbTrip();

            console.log('get api/transports');
            return vm.trips;

        })
        .catch(function(error) {
            console.log(error);
            $q.reject(err); //BEWARE !!!!
        })
        .then(function(valid) { 
            console.log('La page est correctement chargée!');
        });
    }

    function addTrip() {

        console.log(vm.form);

        requestFactory.postNewTrip(vm.form).then(function(data) {

            console.log(data);
            vm.trips = data;
            trips    = data;

            updNbTrip();
            vm.msgAddTrip = { 'stat': true, 'msg': 'Trajet enregistré' };

        })
        .catch(function(err) {
            vm.msgAddTrip = { 'stat': false, 'msg': 'Erreur. Impossible d\'enregistrer le trajet' };
            console.log(err);
        });
    };

    function seeTrip() {

        /* Update du scope */
        vm.tripavoir = trips[vm.tripchoisi];
        vm.idTrip    = vm.tripchoisi;

        /* 2 methodes: la premiere est seulement compatible chrome et firefox */
        var tabDepart = Object.values(trips[vm.tripchoisi].coordinates_from);
        var tabArrive = Object.values(trips[vm.tripchoisi].coordinates_to);

        /* 2ieme methode (Pas utilisé)
            /*var tabDepart = [];
            var tabArrive = [];

            for(var val in trips[vm.tripchoisi].coordinates_from) {
                tabDepart.push(val);
            };
            for(var val in trips[vm.tripchoisi].coordinates_to) {
                tabArrive.push(val);
            };
        */

        googlemapFactory.geocoding(tabDepart[0], tabDepart[1])
        .then(function(address) {
            vm.addressFrom = address;
        });

        googlemapFactory.geocoding(tabArrive[0], tabArrive[1])
        .then(function(address) {
            vm.addressTo = address;
        });

        googlemapFactory.setDirection(tabDepart, tabArrive, trips[vm.tripchoisi].vehicules)
        .then(function(boolMsgErrorVisible) {
            vm.msgErrorDirectionZeroResult = boolMsgErrorVisible;
        });

    };

    function delTrip(id) {

        requestFactory.deleteTrip(id).then(function(res) {

            vm.trips = res;
            trips    = res;
            vm.tripchoisi = null;

            updNbTrip();

        })
        .catch(function(err) {
            console.log(err);
        });
    };

    function updNbTrip() {
        vm.nbtripsinlist = trips.length;
    }

};