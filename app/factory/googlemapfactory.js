angular
    .module('tripAPI')
    .factory('googlemapFactory', googlemapFactory);

function googlemapFactory($q, $rootScope) {

    let map;
    let directionsDisplay = new google.maps.DirectionsRenderer;
    let directionsService = new google.maps.DirectionsService;
    let geocoder          = new google.maps.Geocoder;

    let googlemap = {
        setDirection: setDirection,
        geocoding: geocoding,
        initMap: initMap,
        map: map
    };

    return googlemap;

    function setDirection(tabDepart, tabArrive, travel) {

        let directionErrorZeroResult = $q.defer();

        let depart = tabDepart.join(', ');
        let arrive = tabArrive.join(', ');

        directionsService.route({
            origin: depart,
            destination: arrive,
            travelMode: 'DRIVING'
        }, (response, status) => {
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
        let adressFromCoord = $q.defer();

        let latlng = { 
            lat: parseFloat(lat), 
            lng: parseFloat(lng) 
        };
        
        geocoder.geocode({'location': latlng}, (results, status) => {
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

        map.addListener('rightclick', (coord) => {
            $rootScope.$broadcast('listen', coord);
        });

    };

}