var db = require('./database.js')

module.exports = function(app) {

    app.post("/api/login", function(req, res) {
        db.login(req, res)
        });

    app.post("/api/registration", function(req, res) {
        db.createAccount(req, res, function(data) {
            res.send(data)
        })
    });

}