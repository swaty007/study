var express = require('express');
var router = express.Router();
const {Parser}  = require('../../parserCore/parser'),
    fs = require('fs');

console.log(__dirname);
// sockets
const app = require('express')(),
    server = require('http').Server(app),
    io = require('socket.io')(server);
server.listen(3038);//8082


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

io.on('connection', (socket) => {
  var parse = new Parser();
  parse.setSocket(socket).then(res => {
    socket.on('getGoogle', data => {
      console.log("data = ", data);
      let value = {
        sites: data.sites,
        size: data.size
      };
      console.time("Parser Work");
      parse.getGoogle(value).then( result => {
        console.timeEnd("Parser Work");
        socket.emit('getGoogle', result[0]);
        // response.json(result);
      });
    });

  });
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
