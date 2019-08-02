var express = require('express');
var router = express.Router();
const {Parser}  = require('../../../../../Javascript/Nodejs/parser'),
    fs = require('fs');

console.log(__dirname);
var parse = new Parser();



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/calc', function(req, res, next) {
  const values = req.body.sites.split(',').map(site => site.trim());
  parse.getGoogle(values).then( result => {


    res.render('calc', {
      title: 'Google Calc',
      data: result });
  });

});

module.exports = router;
