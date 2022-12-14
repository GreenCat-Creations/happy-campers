var accounts = require('./accounts.js')
var packing = []

packing.list = [
    'toothbrush',
    'toothpaste',
    'shampoo',
    'conditioner',
    'soap',
]

packing.createRow = function(req, res) {
    let list = []
    for (var i = 0; i < packing.list.length; i++) {
        list[i] = false
    }
    list.unshift('username')
    let placeholders = list.map((item) => '?').join(',')
    let sql = `INSERT INTO packing VALUES (${placeholders})`
    list[0] = req.session.username
    accounts.run(sql, list, (err) => {
        if (err) {
            console.log(err)
        }
        else {
            packing.updatePackingList(req, res)
        }
    })
}


packing.getPackingList = function(req, res) {
    accounts.all(`SELECT * FROM packing WHERE username = '${req.session.username}'`, (err, row) => {
        if (err) { console.log(err) }
        if (row !== undefined && row.length > 0) {
            let checked = []
            for (var i = 0; i < packing.list.length; i++) {
                checked.push(row[0][packing.list[i]])
            }
            let data = {
                field : packing.list,
                checked : checked
            }
            res.send(data)
        }
        else { 
            checked = []
            for (var i = 0; i < packing.list.length; i++) {
                checked[i] = false
            }
            data = {
                field : packing.list,
                checked : checked,
            }
            res.send(data) }
    })
}

packing.updatePackingList = function(req, res) {
    accounts.get(`SELECT * FROM packing WHERE username = '${req.session.username}'`, (err, row) => {
        if (err) {
            console.log(err)
        }
        if (!row) { packing.createRow(req, res) }
        if (row) {
            let pairs = []
            for (var i = 0; i < packing.list.length; i++) {
                pairs.push(`${req.body.field[i]} = '${req.body.checked[i]}'`)
            }
            let sql = `UPDATE packing SET ${pairs.join(',')} WHERE username = '${req.session.username}'`
            accounts.run(sql, (err) => {
                if (err) {
                    console.log(err)
                }
                else {
                    res.send('Updated packing list for ' + req.session.username + '!')
                }
            })
        }
    })
}

packing.createTable = function() {
    accounts.serialize( function () {
        let list = packing.list.map((item) => ` ${item} TEXT`).join(',')
        accounts.run(`CREATE TABLE IF NOT EXISTS packing (username TEXT PRIMARY KEY,${list})`)
    })
}

packing.createTable()

// let sql = `SELECT * FROM packing`;
// accounts.all(sql, [], (err, rows ) => {
//   console.log(err, rows)
// });

module.exports = packing