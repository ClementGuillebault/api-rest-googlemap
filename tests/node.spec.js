let chai = require('chai');
let expect = require('chai').expect;
let chaiHttp = require('chai-http');

chai.use(chaiHttp);

describe('Testing node routing', () => {

    let tmp = {
        'title':'test', 
        'coordinates_from':{
            'lat': 45.02, 'lon': 0.32
        }, 
        'coordinates_to':{
            'lat':42.32, 'lon': -0.32
        }, 
        'vehicule':'DRIVING', 
        'comment': 'comment test'
    };

    let server = 'http://localhost:3000';

    it('GET Request on localhost and receive a correct 200 response on text/html', (done) => {
        console.log('test');
        chai.request(server)
            .get('/')
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res).to.be.html;
                done();
            });
    });

    it('GET Request on /api/transports and receive a json', (done) => {
        chai.request(server)
            .get('/api/transports')
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                done();
            });
    });

    it('POST Request on /api/transports and receive json with add', (done) => {
        chai.request(server)
            .post('/api/transports')
            .send(tmp)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.be.json;
                done();
            });
    });

    it('DELETE Request on /api/transports/id and receive json - add', (done) => {
        chai.request(server)
            .del('/api/transports/11')
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.be.json;
                done();
            });
    });
});
