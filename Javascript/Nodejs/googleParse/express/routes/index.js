var express = require('express');
var router = express.Router();
const {Parser}  = require('../../../../../Javascript/Nodejs/parser'),
    fs = require('fs');

console.log(__dirname);
// sockets
const app = require('express')(),
    server = require('http').Server(app),
    io = require('socket.io')(server);
server.listen(3038);


/* GET home page. */
router.get('/', function(req, res, next) {

  io.on('connection', (socket) => {
    var parse = new Parser();
    parse.setSocket(socket).then(res => {
      socket.on('getGoogle', value => {
        console.log("value = ", value);
        let values = value.sites.split(',').map(site => site.trim());
        parse.getGoogle(values).then( result => {
          socket.emit('getGoogle', result);
          // response.json(result);
        });
      });

    });
  });

  res.render('index', { title: 'Express' });
});




router.post('/calc', function(req, response, next) {
  const values = req.body.sites.split(',').map(site => site.trim());

  // io.on('connection', (socket) => {
  //   parse.setSocket(socket).then(res => {
      parse.getGoogle(values).then( result => {
        response.json(result);
      });
  //   });
  // });

});

module.exports = router;
