var accounts = require('./accounts.js')
var packing = require('./packing.js')
var session = require('./session.js')

module.exports = function(app) {

    app.use( /^\/(?!.*login|.*registration|favicon.ico|.*home).*$/ , function (req, res, next) {
        let cookie = req.headers.cookie
        if (cookie === undefined) {
            res.redirect('/login')
        }
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

    app.post("/api/registration", function(req, res) {
        accounts.create(req, res, function(data) {
            res.send(data)
        })
    })

    app.post("/api/getAccountInfo", function(req, res) {
        accounts.getInfo(req, res)
    })

    app.post("/api/getPackingList", function(req, res) {
        packing.getPackingList(req, res)
    })

    app.post("/api/updatePackingList", function(req, res) {
        packing.updatePackingList(req, res)
    })
}