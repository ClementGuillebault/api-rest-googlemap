angular
    .module('tripAPI')
    .factory('googlemapFactory', googlemapFactory);


/**
 * Factory pour gerer la google map et les fonctions liées
 * @param {$q} $q
 * @param {$rootScope} $rootScope
 * @return {object} retourne les fonctions de la factory
 */
function googlemapFactory($q, $rootScope) {
    let map;
    let directionsDisplay = new google.maps.DirectionsRenderer;
    let directionsService = new google.maps.DirectionsService;
    let geocoder          = new google.maps.Geocoder;

    let googlemap = {
        setDirection: setDirection,
        geocoding: geocoding,
        initMap: initMap,
        refresh: refresh
    };

    return googlemap;

    /**
     * Met en place le service directionRenderer avec les coordonnées envoyées
     * @function setDirection
     * @param {array} tabDepart Contient les coordonnées du point de départ
     * @param {array} tabArrive Contient les coordonnées du point d'arrivé
     * @param {string} travel Le moyen de transport utilisé
     * @return {promise} Retourne un booléen sous forme de promise
     */
    function setDirection(tabDepart, tabArrive, travel) {
        let directionErrorZeroResult = $q.defer();

        let depart = tabDepart.join(', ');
        let arrive = tabArrive.join(', ');

        console.log(travel);

        directionsService.route({
            origin: depart,
            destination: arrive,
            travelMode: travel
        }, (response, status) => {
            if (status === 'OK') {
                directionsDisplay.setMap(map);
                directionsDisplay.setDirections(response);
                directionsDisplay.setPanel(
                    document.getElementById('googlemappanel')
                );
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

    /**
     * Retourne l'adresse formaté grâce à des coordonnées
     * @function geocoding
     * @param {string} lat Latitude
     * @param {string} lng Longitude
     * @return {promise} Retourne l'adresse formaté sous forme de promise
     */
    function geocoding(lat, lng) {
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
                console.log('Erreur GeoCoder: ' + status);
            }
        });

        return adressFromCoord.promise;
    };

    /**
     * Initialisation de la map et de l'evnmt lié
     * @function initMap
     */
    function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 49.15, lng: -0.32},
            zoom: 8
        });

        directionsDisplay.setMap(map);

        /* Event pour la capture des coordonnées */
        map.addListener('rightclick', (coord) => {
            $rootScope.$broadcast('listen', coord);
        });
    };

    /**
     * Permet de rafraichir la map
     * @function refresh
     */
    function refresh() {
        directionsDisplay.setMap(null);
        directionsDisplay.setPanel(null);
    }
}
