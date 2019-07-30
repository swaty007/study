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
var promise = parse.getHtml().then(res => {

    res.forEach(function (i) {
        console.log('write', i.title);
        let html = `<!DOCTYPE html>
<html lang="en" id="wrapper">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${i.title}</title>

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
    <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->

    <link href="./style.css" rel="stylesheet" type="text/css">

    <!-- версия для разработки, отображает полезные предупреждения в консоли -->
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>

    <!-- production-версия, оптимизированная для размера и скорости -->
    <!--    <script src="https://cdn.jsdelivr.net/npm/vue"></script>-->

</head>
<body id="main">
<p>Спаршено с: <a href="${i.href}">${i.href}</a></p>
${i.content}
</body>
</html>`;
        fs.writeFileSync('./Javascript/Vue/parsed/'+i.title.replace('/','')+'.html', html);
    });

}, req => {
    console.log(req)
});

