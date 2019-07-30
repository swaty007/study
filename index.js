// содежимое index.js
const http = require('http');
const port = 3000;
const {Parser}  = require('./Javascript/Nodejs/parser');
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
var test = parse.getHtml();
console.log(test);

