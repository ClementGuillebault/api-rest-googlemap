angular
    .module('tripAPI')
    .factory('requestFactory', requestFactory);

/**
 * Factory pour la gestion des requetes http
 * @param {$http} $http
 * @return {promise} promise
 */
function requestFactory($http) {
    let request = {
        getRoot: getRoot,
        postNewTrip: postNewTrip,
        deleteTrip: deleteTrip
    };

    return request;

    /**
     * Requete GET sur /api/transports
     * @return {promise}
     */
    function getRoot() {
        return $http.get('/api/transports')
            .then(trips)
            .catch(error);
    };

    /**
     * Requete POST sur /api/transports
     * @param {object} data Information à envoyé au serveur
     * @return {promise}
     */
    function postNewTrip(data) {
        return $http.post('/api/transports', data)
            .then(trips)
            .catch(error);
    };

    /**
     * Requete DELETE sur /api/transports/:id
     * @param {int} id L'id de l'objet à supprimer
     * @return {promise}
     */
    function deleteTrip(id) {
        return $http.delete('/api/transports/' + id)
            .then(trips)
            .catch(error);
    };

    /**
     * Retourne l'élement qui nous intéresse de la réponse du serveur
     * @param {response} response 
     * @return {object} Les informations qui nous intéresse
     */
    function trips(response) {
        return response.data._trip.transports;
    }

    /**
     * Gestion des erreurs
     * @param {response} response 
     * @return {string} L'erreur survenue
     */
    function error(response) {
        return 'error ' + response;
    }
}
