// содежимое index.js
const {Parser}  = require('./Javascript/Nodejs/googleParse/parserCore/parser'),
    fs = require('fs');

console.log(__dirname);
var parse = new Parser();
// parse.getGoogle([
//     'ореховое масло','купить черный тмин'
// ]).then( result => {
//     console.log("finish");
//     fs.writeFile('./Javascript/Nodejs/googleParse/google.json', JSON.stringify(result, null, 4),'utf8', (err,res) => {
//         if (err) {
//             console.log(err,'err'); throw new err;
//         }
//     });
// });
parse.initTruecaller();
// parse.getHtmlVue().then( res => { }, req => {console.log(req)});

