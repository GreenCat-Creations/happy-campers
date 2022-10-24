var path = require("path");
var fs = require("fs")

let head = fs.readFileSync("./head.html", "utf8")
let nav = fs.readFileSync("./nav.html", "utf8")

module.exports = function(app) {
  app.get("/", function(req, res) {
    let data = fs.readFileSync('./index.html', 'utf8')
    let page = "".concat(head, nav, data)
    res.send(page)
  });

  app.get("/favicon.ico", function(req, res) {
    res.sendFile(path.join(__dirname, "../favicon.ico"
    
    ));
  });

};