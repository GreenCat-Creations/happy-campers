var db = require('./database.js')
var packing = require('./packing.js')

module.exports = function(app) {

    app.post("/api/login", function(req, res) {
        db.login(req, res)
    });

    app.post("/api/registration", function(req, res) {
        db.createAccount(req, res, function(data) {
            res.send(data)
        })
    });

    app.post("/api/getAccountInfo", function(req, res) {
        db.getAccountInfo(req, res)
    });

    app.post("/api/getPackingList", function(req, res) {
        packing.getPackingList(req, res)
    })

    app.post("/api/updatePackingList", function(req, res) {
        packing.updatePackingList(req, res)
    })
}