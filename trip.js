var fs = require('fs');

class Trip {
    constructor(path) {

        this._path = path;

        fs.readFile(this._path, 'utf8', (err, data) => {

            if (err) throw err;

            /* Si le json n'est pas modifié */
            let newfile = data.replace(/car/gi, 'DRIVING');
            newfile     = newfile.replace(/foot/gi, 'WALKING');
            newfile     = newfile.replace(/bike/gi, 'BICYCLING');

            this._trip = JSON.parse(newfile);

        });

    }

    get trip() {
        return this._trip;
    }

    nbTrip() {
        return this._trip['transports'].length;
    }

    addTrip(addedTrip) {
        this._trip['transports'].push(addedTrip);
        this.updateJson();
        return this._trip;
    }

    deleteTrip(id) {
        this._trip['transports'].splice(id, 1);
        this.updateJson();
        return this._trip;
    }

    updateJson() {
        let stream = fs.createWriteStream(this._path, {'encoding': 'utf8'});
        stream.write(JSON.stringify(this._trip, null, 4));
        stream.end();
    }
}

module.exports = Trip;