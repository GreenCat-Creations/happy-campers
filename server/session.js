var session = {}

session.new = function(row, id) {
    session[id] = {}
    for (item in row) { session[id][item] = (row[item]) }
}


module.exports = session