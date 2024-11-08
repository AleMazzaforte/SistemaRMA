const { conn } =  require('../bd/bd');

module.exports = {
    getAgregarTransporte: (req, res) => {
        res.render('cargarTransporte')
    }
}