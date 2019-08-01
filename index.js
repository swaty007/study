// содежимое index.js
const {Parser}  = require('./Javascript/Nodejs/parser'),
    fs = require('fs');

console.log(__dirname);
var parse = new Parser();
parse.getGoogle([
    'инфинитум','черный тмин','грин аура','casino online','porno'
]).then( res => {
    fs.writeFileSync('./Javascript/Nodejs/googleParse/google.json', JSON.stringify(res, null, 4));
});

// parse.getHtml().then( res => { }, req => {console.log(req)});

