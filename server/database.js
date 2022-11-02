var sqlite = require('sqlite3').verbose();
var crypto = require('crypto')
var jwt = require('jsonwebtoken')
var session = require('./session.js')

var db = new sqlite.Database("accounts.db")

db.serialize( function () {
  db.run(`CREATE TABLE IF NOT EXISTS accounts (username TEXT PRIMARY KEY, salt TEXT, hash TEXT, firstname TEXT, 
    lastname TEXT, email TEXT, phonenumber TEXT, created TEXT, updated TEXT)`)
})


function hashPassword (password, callback) {
    var salt = crypto.randomBytes(16).toString('hex');
    var hash = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString('hex');
    var hashed = {
      salt: salt,
      hash: hash
    }
    callback(null, hashed)
  }

<<<<<<< Updated upstream:server/database.js
db.login = function (req, res) {
=======
  accounts.logout = function (req, res) {
    let cookie = req.headers.cookie
    let token = cookie.split("=Bearer")[1]
    session[token] = null
    res.send({
        success : true,
        message : 'You have been logged out. Goodbye!',
    })
  }

  accounts.login = function (req, res) {
>>>>>>> Stashed changes:server/accounts.js
    let username = req.body.username
    db.get(`SELECT * FROM accounts WHERE username = ?`, username, function (err, row) {
        if (err) {
            console.log(err)
        }
        else {
            if (row) {
                let hash = crypto.pbkdf2Sync(req.body.password, row.salt, 1000, 64, `sha512`).toString('hex');
                if (hash === row.hash) {
<<<<<<< Updated upstream:server/database.js
                    let token = jwt.sign({username: username}, 'secret', {expiresIn: '1000h'})
                    res.send ( {
                        message: 'login successful',
=======
                    let token = jwt.sign({username: username}, 'secret', {expiresIn: '30s'})
                    res.cookie('access_token', 'Bearer' + token, {})
                    session.new(row, token)
                    res.send ({
                        message: 'Login successful!',
>>>>>>> Stashed changes:server/accounts.js
                        success: true,
                        token: token,
                        username: row.username,
                        firstname: row.firstname,
                        url: '/home'
                    } )
                }
                else {
                    res.send({
                        message: 'password incorrect',
                        success: false,
                        url: '/login',
                    })
                }
            }
            else {
                res.send({
                    message: 'username not found',
                    success: false,
                    url: '/login',
                })
            }
        }
    })
}



db.createAccount = function(req, res) {
    db.get(`SELECT username FROM accounts WHERE username = '${req.body.username}'`, (err, row) => {
      if (row) {
        res.send('username taken')
      }
      else {
        hashPassword(req.body.password, (err, hash) => {
          db.run(`INSERT INTO accounts (username, hash, salt, firstname, lastname, email, phonenumber, created, updated) VALUES 
            ('${req.body.username}', '${hash.hash}', '${hash.salt}', '${req.body.firstname}', '${req.body.lastname}',
            '${req.body.email}', '${req.body.phonenumber}', '${Date.now()}', '${Date.now()}' )`, (err) => {
              if (err) {
                console.log(err)
              }
              else {
                res.send({
                  message : 'account created',
                  success : true,
                })
              }
            })
        })}
    })
  }

  db.getAccountInfo = function(req, res) {
    console.log(req.body)
    db.get(`SELECT * FROM accounts WHERE username = '${req.body.username}'`, (err, row) => {
      if (err) {
        console.log(err)
      }
      else {
        res.send(row)
        console.log(row)
      }
    })
  }


// let sql = `SELECT * FROM accounts`;
// db.all(sql, [], (err, rows ) => {
//   console.log(err, rows)
// });

module.exports = db