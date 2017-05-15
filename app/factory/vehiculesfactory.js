angular
    .module('tripAPI')
    .factory('vehiculesFactory', vehiculesFactory);

function vehiculesFactory() {

    /* Tableau des moyen de locomotion */
    let vehicules = [
        {'name': 'Voiture', 'value': 'DRIVING'},
        {'name': 'A pied', 'value': 'WALKING'},
        {'name': 'En vélo', 'value': 'BICYCLING'},
        {'name': 'Transport en commun', 'value': 'TRANSIT'}
    ];

    return vehicules;    
}