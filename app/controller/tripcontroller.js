angular
    .module('tripAPI')
    .controller('TripController', TripController);

function TripController(googlemapFactory, requestFactory, vehiculesFactory, $rootScope, $scope) {

    let vm    = this;
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
        requestFactory.getRoot().then((res) => {

            vm.trips = res;
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
                vm.captureFrom    = false;
            }

            if(vm.captureTo) {
                vm.form.arriveLat = parseFloat(data.latLng.lat().toFixed(2));
                vm.form.arriveLon = parseFloat(data.latLng.lng().toFixed(2));
                vm.captureTo      = false;
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

            requestFactory.postNewTrip(vm.form).then((res) => {

                vm.trips = res;

                updNbTrip();
                vm.msgAddTrip = { 'stat': true, 'msg': 'Trajet enregistré' };

                vm.form = {};

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

        vm.tripavoir  = vm.trips[vm.tripchoisi];
        vm.idTrip     = vm.tripchoisi;

        let tabDepart = Object.values(vm.trips[vm.tripchoisi].coordinates_from);
        let tabArrive = Object.values(vm.trips[vm.tripchoisi].coordinates_to);

        googlemapFactory.geocoding(tabDepart[0], tabDepart[1])
        .then((address) => {
            vm.addressFrom = address;
        });

        googlemapFactory.geocoding(tabArrive[0], tabArrive[1])
        .then((address) => {
            vm.addressTo = address;
        });

        googlemapFactory.setDirection(tabDepart, tabArrive, vm.trips[vm.tripchoisi].vehicule)
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
        vm.nbtripsinlist = vm.trips.length;
    }

};