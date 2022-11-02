var db = require('./database.js')
var packing = require('./packing.js')
var session = require('./session.js')

module.exports = function(app) {

<<<<<<< Updated upstream
    app.post("/api/login", function(req, res) {
        db.login(req, res)
    });
=======
    app.use( /^\/(?!.*login|.*registration|favicon.ico|.*home).*$/ , function (req, res, next) {
        let cookie = req.headers.cookie
        let token = cookie.split("=Bearer")[1]
        if (session[token]) {
            req.session = session[token]
            next()
        }
        if (!session[token]) {
            res.redirect('/login')
        }
    })

    app.post("/api/login", function(req, res) {
        accounts.login(req, res)
    })

    app.post("/api/logout", function(req, res) {
        accounts.logout(req, res)
    })
>>>>>>> Stashed changes

    app.post("/api/registration", function(req, res) {
        db.createAccount(req, res, function(data) {
            res.send(data)
        })
    })

    app.post("/api/getAccountInfo", function(req, res) {
<<<<<<< Updated upstream
        db.getAccountInfo(req, res)
    });
=======
        accounts.getInfo(req, res)
    })
>>>>>>> Stashed changes

    app.post("/api/getPackingList", function(req, res) {
        packing.getPackingList(req, res)
    })

    app.post("/api/updatePackingList", function(req, res) {
        packing.updatePackingList(req, res)
    })
}