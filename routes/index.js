var express = require('express');
var router  = express.Router();
var Trip = require('../trip.js');

let trip = new Trip('transports.json');

/**
 * Retourne le fichier json actuel sous format text/json
 * GET server/api/transports
 */
router.get('/api/transports', function(req, res) {
	res.json(trip);
});

/**
 * Retourne
 * POST server/api/transports
 * @return {object} retourne l'object modifié
 */
router.post('/api/transports', function(req, res) {
	console.log(req.body.departlat);
	let tmp = {
		"title": req.body.title,
		"coordinates_from": {
			"lat": req.body.departLat,
			"lon": req.body.departLon
		},
		"coordinates_to": {
			"lat": req.body.arriveLat,
			"lon": req.body.arriveLon
		},
		"vehicule": req.body.vehicule,
		"comment": req.body.comment
	};

	trip.addTrip(tmp);
	res.json(trip);
});

/**
 * Retourne
 * DELETE server/api/transports
 * @return {object} retourne l'object modifié
 */
router.delete('/api/transports/:id', function(req, res) {
	console.log(req.params.id);
	trip.deleteTrip(req.params.id);
	res.json(trip);
});

/**
 * Permet la gestion du front end par angularjs
 */
router.get('*', function(req, res) {
	res.sendfile('./views/index.html');
});

module.exports = router;
