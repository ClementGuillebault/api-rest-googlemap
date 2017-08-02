/**
 * Class Trip
 */
class Trip {

    /**
     * Constructeur
     * J'ai ajouté la partie avec les replace car le fichier json est
     * d'origine. Il serait plus simple de modifier le json pour
     * qu'il soit ok.
     * @constructor Trip
     * @param {string} path Path du fichier json
     * @param {filestream} fs Injection de dépendance du module fs
     */
    constructor(path, fs) {

        this._path = path;
        this._fs   = fs;

        this._fs.readFile(this._path, 'utf8', (err, data) => {

            if (err) throw err;

            /* Si le json n'est pas modifié */
            let newfile = data.replace(/car/gi, 'DRIVING');
            newfile     = newfile.replace(/foot/gi, 'WALKING');
            newfile     = newfile.replace(/bike/gi, 'BICYCLING');

            this._trip = JSON.parse(newfile);

        });

    }

    /**
     * Getters
     */
    get trip() {
        return this._trip;
    }

    /**
     * Retourne le nbr de trip dans l'object
     * @function nbTrip
     * @return {int} nb de trip dans l'object
     */
    nbTrip() {
        return this._trip['transports'].length;
    }

    /**
     * Ajoute un trip à l'object
     * @function addTrip
     * @param {array} addedTrip 
     * @return {object} l'object modifié
     */
    addTrip(addedTrip) {
        this._trip['transports'].push(addedTrip);
        this.updateJson();
        return this._trip;
    }

    /**
     * Supprime un element à l'indice donné
     * @function deleteTrip
     * @param {int} id indice de l'élement à supprimer
     * @return {object} L'object modifié
     */
    deleteTrip(id) {
        this._trip['transports'].splice(id, 1);
        this.updateJson();
        return this._trip;
    }

    /**
     * Update le fichier json
     * @function updateJson
     */
    updateJson() {
        let stream = this._fs.createWriteStream(
            this._path, {'encoding': 'utf8'}
        );
        stream.write(JSON.stringify(this._trip, null, 4));
        stream.end();
    }
}

module.exports = Trip;