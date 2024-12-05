const { conn } = require('../bd/bd');

module.exports = {
    getEstadisticas: (req, res) => {
        res.render('estadisticas')
    }
}