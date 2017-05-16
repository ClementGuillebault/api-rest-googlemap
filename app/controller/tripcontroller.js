angular
    .module('tripAPI')
    .controller('TripController', TripController);

function TripController(googlemapFactory, requestFactory, vehiculesFactory, $rootScope, $scope) {

    let vm    = this;
    let trips = {};
    vm.form   = {};

    vm.getAccueil = getAccueil;
    vm.addTrip    = addTrip;
    vm.seeTrip    = seeTrip;
    vm.delTrip    = delTrip;
    vm.updNbTrip  = updNbTrip;

    vm.vehicules  = vehiculesFactory;

    googlemapFactory.initMap();

    getAccueil();

    setEventOn();

    /**
     * Gere la partie GET / et recoit l'objet trip provenant du json
     * Créée pour un gain de clarté dans le code
     * @function getAccueil
     */
    function getAccueil() {
        requestFactory.getRoot().then((response) => {

            vm.trips = response;
            trips    = response;
            updNbTrip();

            return vm.trips;
        })
        .catch((error) => {
            console.log(error);
            $q.reject(err);
        })
        .then((valid) => { 
            console.log('La page est correctement chargée!');
        });
    }

    /**
     * Gere l'écoute de l'evenement sur la googlemap créer dans la factory
     * Créee pour plus de clarté dans le code
     * @function setEventOn
     */
    function setEventOn() {
        $rootScope.$on('listen', (ev, data) => {
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
    }

    /**
     * Permet l'ajout de nouveau trip ddans le fichier json
     * @function addTrip
     */
    function addTrip() {

        if ($scope.form.$valid) {

            if (!vm.form.comment) {
                vm.form.comment = '';
            }

            requestFactory.postNewTrip(vm.form).then((data) => {

                vm.trips = data;
                trips    = data;

                updNbTrip();
                vm.msgAddTrip = { 'stat': true, 'msg': 'Trajet enregistré' };

            })
            .catch((err) => {
                vm.msgAddTrip = { 'stat': false, 'msg': 'Erreur. Impossible d\'enregistrer le trajet' };
                console.log(err);
            });
        }
    };

    /**
     * Permet d'actualiser la map, le panel ainsi que les informations
     * lors d'un clique sur un trip
     * @function seeTrip
     */
    function seeTrip() {

        /* Update du scope */
        vm.tripavoir = trips[vm.tripchoisi];
        vm.idTrip    = vm.tripchoisi;

        /* 2 methodes: la premiere est seulement compatible chrome et firefox */
        let tabDepart = Object.values(trips[vm.tripchoisi].coordinates_from);
        let tabArrive = Object.values(trips[vm.tripchoisi].coordinates_to);

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
        .then((address) => {
            vm.addressFrom = address;
        });

        googlemapFactory.geocoding(tabArrive[0], tabArrive[1])
        .then((address) => {
            vm.addressTo = address;
        });

        googlemapFactory.setDirection(tabDepart, tabArrive, trips[vm.tripchoisi].vehicules)
        .then((boolMsgErrorVisible) => {
            vm.msgErrorDirectionZeroResult = boolMsgErrorVisible;
        });

    };

    /**
     * Supprimer un élement de l'objet trip
     * @function delTrip
     * @param {int} id l'id du trip à supprimer
     */
    function delTrip(id) {

        requestFactory.deleteTrip(id).then((res) => {

            vm.trips = res;
            trips    = res;
            vm.tripchoisi = null;

            updNbTrip();
            googlemapFactory.refresh();

        })
        .catch((err) => {
            console.log(err);
        });
    };

    /**
     * Update du nombre de trip enregistré
     * @function updNbTrip
     */
    function updNbTrip() {
        vm.nbtripsinlist = trips.length;
    }

};