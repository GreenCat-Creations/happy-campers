var path = require("path")
var fs = require("fs")

let head = fs.readFileSync("./head.html", "utf8")
let nav = fs.readFileSync("./nav.html", "utf8")

module.exports = function(app) {

  app.get("/login", function(req, res) {
    let data = fs.readFileSync("./login.html", "utf8")
    let page = "".concat(head, nav, data)
    res.send(page)
  });

  app.get("/home", function(req, res) {
    let data = fs.readFileSync("./home.html", "utf8")
    let page = "".concat(head, nav, data)
    res.send(page)
  });

  app.get("/handbook", function(req, res) {
    let data = fs.readFileSync("./handbook.html", "utf8")
    let page = "".concat(head, nav, data)
    res.send(page)
  });

  app.get("/packing", function(req, res) {
    let data = fs.readFileSync("./packing.html", "utf8")
    let page = "".concat(head, nav, data)
    res.send(page)
  });

  app.get("/account", function(req, res) {
    let data = fs.readFileSync("./account.html", "utf8")
    let page = "".concat(head, nav, data)
    res.send(page)
  });

  app.get("/camper", function (req, res) {
    let data = fs.readFileSync("./camper.html", "utf8")
    let page = "".concat(head, nav, data)
    res.send(page)
  });

  app.get("/registration", function(req, res) {
    let data = fs.readFileSync('./registration.html', 'utf8')
    let page = "".concat(head, nav, data)
    res.send(page)
    });
    
  app.get("/favicon.ico", function(req, res) {
    res.sendFile(path.join(__dirname, "../favicon.ico"
    ));
  });

  app.get("*", function(req, res) {
    let data = fs.readFileSync('./login.html', 'utf8')
    let page = "".concat(head, nav, data)
    res.send(page)
  })

}