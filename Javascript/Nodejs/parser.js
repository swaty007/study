const tress = require('tress'),
    needle = require('needle'),
    cheerio = require('cheerio'),
    resolve = require('url').resolve,
    fs = require('fs');
var tunnel = require('tunnel');
var myAgent = tunnel.httpsOverHttp({
    proxy: {
        host: '95.38.209.126',
        port: 80, // Defaults to 443
    }
});
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(3038);
io.on('connection', function(socket){
    console.log('a user is connected')
    setInterval(()=>{
        socket.emit('news', { hello: 'world' });
    },5000)
});


class Parser {
    constructor() {
        this.results = [];
        this.threads = 1;
        this.sites = {};
        this.query_json = [];
        this.html_cache_time = 24;
    }

    initParserHtmlVue() {
        this.domain = 'https://ru.vuejs.org';
        this.URL = 'https://ru.vuejs.org/v2/guide/installation.html';
        this.active_link = '.sidebar-link.current';
        this.next_link = '.sidebar-link';
        this.content = '.content.guide.with-sidebar';
        console.log(resolve,'resolve');
        // `tress` последовательно вызывает наш обработчик для каждой ссылки в очереди
        this.promise = new Promise((resolve, reject) => {
            // Эта функция будет вызвана автоматически

            // В ней можно делать любые асинхронные операции,
            // А когда они завершатся — нужно вызвать одно из:
            // resolve(результат) при успешном выполнении
            // reject(ошибка) при ошибке

        this.q = tress((url, callback) => {

            //тут мы обрабатываем страницу с адресом url
            needle.get(url, (err, res) => {
                if (err) throw err;

                // здесь делаем парсинг страницы из res.body
                // делаем results.push для данных о новости
                // делаем q.push для ссылок на обработку

                // парсим DOM
                var $ = cheerio.load(res.body);
                //информация о новости

                $('#ad').remove();
                this.results.push({
                    title: $('h1').text(),
                    href: url,
                    content: $(this.content).html(),
                    size: $(this.content).html().length
                    });

                var next_el = $(this.active_link).parent('li').next('li');

                if (next_el.find(this.next_link).length) {
                    var href = next_el.find(this.next_link).attr('href');
                } else {
                    var href = next_el.next().find(this.next_link).attr('href');
                }

                console.log(this.domain,href);
                if (href) {
                    this.q.push (this.domain+href);
                }
                callback(); //вызываем callback в конце
            });

        }, this.threads);
        // эта функция выполнится, когда в очереди закончатся ссылки
            this.q.drain = () => {
                // fs.writeFileSync('./data.json', JSON.stringify(this.results, null, 4));
                resolve(this.results);
                this.results.forEach(function (i) {
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
            }
        });
    }
    initGoogle() {
        this.size = 2; //x10
        this.sites = {};
        this.promise = new Promise((resolve, reject) => {
            this.q = tress((data, callback) => {
                this.requestGet(data,callback);
            }, this.threads);
            this.q.drain = () => {
                resolve(this.sites);
            }
        });
    }
    requestGet (data, callback) {
        var proxy = {
            agent: myAgent,
        };
        fs.stat('./Javascript/Nodejs/googleParse/queries/'+data.query+data.n_start+'.json',(error_stats, stats) => {
            if (error_stats || (Date.now() - stats.mtimeMs)/(1000*60*60) > this.html_cache_time) {
                console.log(error_stats,'error_stats or cache_time');
                needle.get(data.url, {},(err, res) => { // { agent: myAgent },
                    if (err) {
                        console.log(err,'err');
                        return;
                    }
                    parseHtml (res.body)
                });
                return;
            }
            fs.readFile('./Javascript/Nodejs/googleParse/queries/'+data.query+data.n_start+'.json','utf8',  (error, contentHtml) => {
                if (error) {
                    console.log(error, "error");
                    throw new error;
                }
                loadHtml(contentHtml);
            });
        });

         var parseHtml = (html) => {
            let $ = cheerio.load(html),
                sites = {},
                n = data.n_start;
             this.query_json = [];
            $('footer').remove();
            $('header').remove();

            $('a').each((index, element) => {
                let link = $(element),
                    href = decodeURI(link.attr('href')),
                    domain = href.slice(
                        href.indexOf('://')+3,
                        href.indexOf('/', href.indexOf('://')+3));

                if (href.indexOf("url?q=") > -1) {
                    if (link.parent().siblings('span').find('a').length > 0 || link.text().length === 0) {
                        return;
                    }
                    if (typeof this.sites[domain] === 'undefined') {
                        this.sites[domain] = [];
                    }
                    sites = {
                        title: link.text(),
                        domain: domain,
                        href: href.slice(href.indexOf("url?q=")+6, href.indexOf('&',href.indexOf("url?q="))),
                        query: data.query,
                        position: n,
                    };
                    this.query_json.push(sites);
                    this.sites[domain].push(sites);
                    // this.sites[domain] = Object.assign(this.sites[domain], sites);
                    n++;
                }
            });
             this.googleParseMeta();
             this.meta_q.drain = () => {
                 fs.writeFile('./Javascript/Nodejs/googleParse/queries/'+data.query+data.n_start+'.json',
                     JSON.stringify(this.query_json, null, 4),
                     'utf8', (w_err,w_res) => {
                         if (w_err) {
                             console.log(w_err,'w_err'); throw new w_err;
                         }
                         console.log(data.query,data.n_start, "GET");
                         setTimeout(() => {
                             callback();
                         },1000);
                     });
             };
        };
        var loadHtml = (json) => {
            JSON.parse(json).forEach( site => {
                if (typeof this.sites[site.domain] === 'undefined') {
                    this.sites[site.domain] = [];
                }
                this.sites[site.domain].push(site);
            });
            console.log(data.query, data.n_start, "JSON LOAD");
            callback();
        }
    }
    googleParseMeta () {
        this.meta_q = tress((urlMeta, callbackMeta) => {
            needle.get(urlMeta.href, (errMeta, resMeta) => { // { agent: myAgent },
                if (errMeta) {
                    console.log(errMeta,'errMeta');
                    callbackMeta();
                    return;
                }
                let $ = cheerio.load(resMeta.body);
                urlMeta.meta = {
                    title: $("head title").text(),
                    description: $("meta[name='description']").attr("content"),
                    keywords: $("meta[name='keywords']").attr("content"),
                    h1: $('h1').text()
                };
                callbackMeta();
            });
        },20);
        this.query_json.forEach(site => {
            if (Object.keys(site).indexOf('meta') === -1) {
                this.meta_q.push(site);
            }
        });
        // console.log(sites_url);
        // resolve(this.sites);
    }
    getHtmlVue () {
        this.initParserHtmlVue();
        this.q.push(this.URL);
        return this.promise;
    }
    getGoogle (urls) {
        this.initGoogle();
        urls.forEach(i => {
            for (let n = 0; n < this.size; n++) {
                let url = encodeURI(`https://www.google.com.ua/search?hl=ru&source=hp&q=${i}&oq=${i}`);
                if (n > 0) {
                    url += '&start='+String(n*10)
                }
                this.q.push({
                    url: url,
                    query: i,
                    n_start: n*10
                });
            }
        });
        return this.promise;
    }
}

// export default Parser;
module.exports = {
    Parser
};
// module.export = Parser;
