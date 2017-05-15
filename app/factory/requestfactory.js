angular
    .module('tripAPI')
    .factory('requestFactory', requestFactory);

function requestFactory($http) {
    let request = {
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