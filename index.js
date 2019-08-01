// содежимое index.js
const http = require('http'),
    port = 3000,
    {Parser}  = require('./Javascript/Nodejs/parser'),
    fs = require('fs');
// import Parser from './Javascript/Nodejs/parser';

// const requestHandler = (request, response) => {
//     console.log(request.url)
//     response.end('Hello Nodejs Server!')
// };
// const server = http.createServer(requestHandler)
// server.listen(port, (err) => {
//     if (err) {
//         return console.log('something bad happened', err)
//     }
//     console.log(`server is listening on ${port}`)
// });

var parse = new Parser();
parse.getGoogle([
    // 'инфинитум','черный тмин','грин аура','casino online','porno'
    'грин аура','green aura', "Грин Аура"
]).then( res => {
    fs.writeFileSync('./Javascript/Nodejs/googleParse/google.json', JSON.stringify(res, null, 4));
});

// parse.getHtml().then( res => { }, req => {console.log(req)});

