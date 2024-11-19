const {conn}  = require('../bd/bd');

module.exports = {
    getImprimirEtiqueta: (req, res) => {
        res.render('imprimirEtiqueta');
    }
}