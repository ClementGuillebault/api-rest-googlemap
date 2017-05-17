let expect = chai.expect;

describe('Controller', () => {
    beforeEach(module('tripAPI'));

    let $controller;
    let $httpBackEnd;
    let $http;

	let tmp = {
        'transports': [{
		"title": 'test',
		"coordinates_from": {
			"lat": 50.00,
			"lon": 20.00
		},
		"coordinates_to": {
			"lat": 30.00,
			"lon": 10.00
		},
		"vehicule": 'DRIVING',
		"comment": 'comment test'
	}]};

    describe('Test routing', () => {

        beforeEach(inject((_$httpBackend_, _$http_) => {
            $httpBackEnd = _$httpBackend_;
            $http = _$http_;
        }));

        it('should GET / and receive a trip object', () => {

            let scope = {};

            $httpBackEnd.whenGET('http://localhost:3000/api/transports')
            .respond(200, { data:tmp });

            $http.get('http://localhost:3000/api/transports')
            .then((data, status, headers, config) => {
                scope.data = data;
            });

            $httpBackEnd.flush();
            expect(scope.data.data.data).to.be.obj;

        });

        it('should POST /api/transports and receive post info', () => {

            let scope = {};

            $httpBackEnd.whenPOST('http://localhost:3000/api/transports')
            .respond(200, { data: tmp });

            $http.post('http://localhost:3000/api/transports')
            .then((data, status, headers, config) => {
                scope.data = data;
            });

            $httpBackEnd.flush();
            expect(scope.data.data.data).to.be.obj;

        });

        it('should DELETE /api/transport/1 and receive object trip', () => {
            let scope = {};

            $httpBackEnd.whenDELETE('http://localhost:3000/api/transports/1')
            .respond(200, { data: tmp });

            $http.delete('http://localhost:3000/api/transports/1')
            .then((data, status, headers, config) => {
                scope.data = data;
            });

            $httpBackEnd.flush();
            expect(scope.data.data.data).to.be.obj;            
        });

    })

    describe('testing controller and factory', () => {

        beforeEach(inject((_$controller_) => {
            $controller = _$controller_;
        }));

        it('should be eql to vehicules array from factoryvehicules', () => {
            let $scope = {};
                let vehicules = [
                    {'name': 'Voiture', 'value': 'DRIVING'},
                    {'name': 'A pied', 'value': 'WALKING'},
                    {'name': 'En vélo', 'value': 'BICYCLING'},
                    {'name': 'Transport en commun', 'value': 'TRANSIT'}
                ];

            let controler = $controller('TripController', {
                $scope: $scope
            });
            expect(controler.vehicules).to.eql(vehicules);
        });

        it('should update nbtripsinlist correctly', () => {

            let $scope = {};
            let controler = $controller('TripController', {
                $scope: $scope
            });

            controler.trips = [];
            controler.updNbTrip();
            expect(controler.nbtripsinlist).to.be.equal(0);
            
            controler.trips.push(tmp);
            controler.updNbTrip();
            expect(controler.nbtripsinlist).to.be.equal(1);

            controler.trips.splice(0, 1);
            controler.updNbTrip();
            expect(controler.nbtripsinlist).to.be.equal(0);

        });

        it('should active error and succes message', () => {
            let $scope = {};
            let controler = $controller('TripController', {
                $scope: $scope
            });

            console.log(controler);
        });
    });
});