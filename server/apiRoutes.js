var accounts = require('./accounts.js')
var packing = require('./packing.js')

module.exports = function(app) {

    app.use( /^\/(?!.*login|.*registration|favicon.ico|.*home).*$/ , function (req, res, next) {
        let cookie = req.headers.cookie
        let token = cookie.split("=Bearer")[1]
        req.session = {}
        if (token) {
            accounts.verifyToken(token, function (err, decoded) {
                if (err) {
                    console.log(err)
                }
                else {
                    if (!req.session) { res.redirect('/login') }
                    else {
                    req.session.token = token
                    req.session.username = decoded.username
                    next()
                    }
                }
            })
        }
        else {
            res.redirect('/login')
        }
    })

    app.post("/api/login", function(req, res) {
        accounts.login(req, res)
    });

    app.post("/api/logout", function(req, res) {
        accounts.logout(req, res)
    });

    app.post("/api/registration", function(req, res) {
        accounts.create(req, res, function(data) {
            res.send(data)
        })
    });

    app.post("/api/getAccountInfo", function(req, res) {
        accounts.getInfo(req, res)
    });

    app.post("/api/getPackingList", function(req, res) {
        packing.getPackingList(req, res)
    })

    app.post("/api/updatePackingList", function(req, res) {
        packing.updatePackingList(req, res)
    })
}