var sqlite = require('sqlite3').verbose();
var crypto = require('crypto')
var jwt = require('jsonwebtoken')
var session = require('./session.js')

var accounts = new sqlite.Database("accounts.db")

accounts.serialize( function () {
  accounts.run(`CREATE TABLE IF NOT EXISTS accounts (username TEXT PRIMARY KEY, salt TEXT, hash TEXT, firstname TEXT, 
    lastname TEXT, email TEXT, phonenumber TEXT, created TEXT, updated TEXT, camper TEXT, parent TEXT, leader TEXT)`)
})

function hashPassword (password, callback) {
    var salt = crypto.randomBytes(16).toString('hex')
    var hash = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString('hex')
    var hashed = {
      salt: salt,
      hash: hash
    }
    callback(null, hashed)
  }

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
    let username = req.body.username
    accounts.get(`SELECT * FROM accounts WHERE username = ?`, username, function (err, row) {
        if (err) {
            console.log(err)
        }
        else {
            if (row) {
                let hash = crypto.pbkdf2Sync(req.body.password, row.salt, 1000, 64, `sha512`).toString('hex');
                if (hash === row.hash) {
                    let token = jwt.sign({username: username}, 'secret', {expiresIn: '30s'})
                    res.cookie('access_token', 'Bearer' + token, {})
                    session.new(row, token)
                    res.send ({
                        message: 'Login successful!',
                        success: true,
                        username: row.username,
                        firstname: row.firstname,
                        url: '/home'
                    })
                }
                else {
                    res.send({
                        message: 'Incorrect password',
                        success: false,
                        url: '/login',
                    })
                }
            }
            else {
                res.send({
                    message: 'Account not found',
                    success: false,
                    url: '/login',
                })
            }
        }
    })
}

accounts.create = function(req, res) {
    accounts.get(`SELECT username FROM accounts WHERE username = '${req.body.username}'`, (err, row) => {
      if (row) {
        res.send('username taken')
      }
      else {
        hashPassword(req.body.password, (err, hash) => {
          accounts.run(`INSERT INTO accounts (username, hash, salt, firstname, lastname, email, phonenumber, camper, parent, leader, created, updated) VALUES 
            ('${req.body.username}', '${hash.hash}', '${hash.salt}', '${req.body.firstname}', '${req.body.lastname}',
            '${req.body.email}', '${req.body.phonenumber}', '${req.body.camper}', '${req.body.parent}', '${req.body.leader}', '${Date.now()}', '${Date.now()}' )`, (err) => {
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

  accounts.getInfo = function(req, res) {
    console.log(req.body)
    accounts.get(`SELECT * FROM accounts WHERE username = '${req.body.username}'`, (err, row) => {
      if (err) {
        console.log(err)
      }
      else {
        res.send(row)
      }
    })
  }

  accounts.verifyToken = function (token, callback) {
    jwt.verify(token, 'secret', function (err, decoded) {
      if (err) {
        callback(err)
      }
      else {
        callback(null, decoded)
      }
    })
  }

// let sql = `SELECT * FROM accounts`;
// account.all(sql, [], (err, rows ) => {
//   console.log(err, rows)
// });

module.exports = accounts