const tress = require('tress'),
    needle = require('needle'),
    cheerio = require('cheerio'),
    // resolve = require('url').resolve,
    fs = require('fs');
var tunnel = require('tunnel');
var myAgent = tunnel.httpsOverHttp({
    proxy: {
        host: '95.38.209.126',
        port: 80, // Defaults to 443
    }
});
const app = require('express')(),
    server = require('http').Server(app),
    io = require('socket.io')(server);
server.listen(3038);
const puppeteer = require('puppeteer-extra');
// add stealth plugin and use defaults (all evasion techniques)
const pluginStealth = require("puppeteer-extra-plugin-stealth");
// add recaptcha plugin and provide it your 2captcha token
// 2captcha is the builtin solution provider but others work as well.
const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha');
puppeteer.use(pluginStealth());
puppeteer.use(
    RecaptchaPlugin({
        provider: { id: '2captcha', token: 'XXXXXXX' },
        visualFeedback: true // colorize reCAPTCHAs (violet = detected, green = solved)
    })
);


class Parser {
    constructor() {
        this.results = [];
        this.threads = 1;
        this.sites = {};
        this.html_cache_time = 24;
        this.requestPause = 1500;
        this.socket = "";

        io.sockets.on('connection', (socket) => {
            this.socket = socket;
            console.log('connect');
            this.socket.on('getGoogle', (result) => {
                console.log(result,'result getGoogle Back');
                this.parseHtml(result.res.body, result.data, result.cb);
            });
        });
    }
    initGoogle() {
        this.size = 1; //x10
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
    requestGet (data, callback) {//, meta = true, html = null
        var proxy = {
            agent: myAgent,
        };
        fs.stat('./Javascript/Nodejs/googleParse/queries/'+data.query+data.n_start+'.json',(error_stats, stats) => {
            if ( error_stats || (Date.now() - stats.mtimeMs)/(1000*60*60) > this.html_cache_time) { //!meta ||
                if (error_stats != null) {
                    console.log('error_stats or cache_time',error_stats.path,error_stats.code);
                    this.socket.emit('console',['error_stats or cache_time',error_stats.path,error_stats.code]);
                }
                // this.socket.emit('getGoogle', { data: data, cb: callback });
                // if (meta) {
                    needle.get(data.url, {},(err, res) => { // { agent: myAgent },
                        if (err) {
                            console.log(err,'err');
                            this.socket.emit('console',[err,'err']);
                            return;
                        }
                        // fs.writeFile('./Javascript/Nodejs/googleParse/queries/'+data.query+data.n_start+'.html', res.body, 'utf8');

                        this.parseHtml (res.body, data, callback, true)
                    });
                // } else {
                //     this.parseHtml(html, data, null, false);
                // }
                return;
            }
            fs.readFile('./Javascript/Nodejs/googleParse/queries/'+data.query+data.n_start+'.json','utf8',  (error, contentJson) => {
                if (error) {
                    console.log(error, "error");
                    this.socket.emit('console',[error, "error"]);
                    throw new error;
                }
                loadHtml(contentJson);
            });
        });
        var loadHtml = (json) => {
            JSON.parse(json)["googleSearch"].forEach( site => {
                if (typeof this.sites[site.domain] === 'undefined') {
                    this.sites[site.domain] = [];
                }
                this.sites[site.domain].push(site);
            });
            console.log(data.query, data.n_start, "JSON LOAD");
            this.socket.emit('console',[data.query, data.n_start, "JSON LOAD"]);
            callback();
        }
    }
     async parseHtml (html, data, callback, meta = true) {
        let $ = cheerio.load(html),
            sites = {},
            queries = {},
            result = {
                queriesMore: [],
                googleSearch: []
            },
            n = data.n_start,
            n_inside = -1;

        $('footer').remove();
        $('header').remove();
        $('a').each( async(index, element) => {
            // return;
            await new Promise( async (resolveEach,rejectEach) => {
                let link = $(element),
                    href = decodeURI(link.attr('href')),
                    domain = href.slice(
                        href.indexOf('://')+3,
                        href.indexOf('/', href.indexOf('://')+3));

                if (href.indexOf("url?q=") > -1) {
                    if (link.parent().siblings('span').find('a').length > 0 || link.text().length === 0) {
                        return;
                    }

                    sites = {
                        title: link.text(),
                        domain: domain,
                        href: href.slice(href.indexOf("url?q=")+6, href.indexOf('&',href.indexOf("url?q="))),
                        query: data.query,
                        position: n,
                    };
                    result["googleSearch"].push(sites);
                    if (typeof this.sites[domain] === 'undefined' && meta) {
                        this.sites[domain] = [];
                    }
                    if (meta) {
                        this.sites[domain].push(sites);
                    }

                    // this.sites[domain] = Object.assign(this.sites[domain], sites);
                    n++;
                    resolveEach();
                } else if (href.indexOf("/search?") > -1 && link.hasClass("tHmfQe")) {
                    queries = {
                        title: link.text(),
                        href: "https://www.google.com"+href,
                        html: link.html()
                    };
                    result["queriesMore"].push(queries);

                    console.log('end1',n_inside);
                    // await googleParseQueries();
                    n_inside++;
                    await this.googleParseQueries(result,href,n_inside, meta).then( resolveQuery => {
                         console.log('end4',n_inside);

                         resolveQuery.forEach((element, key) => {
                             if (typeof result["queriesMore"][key]["inside"] === 'undefined') {
                                 result["queriesMore"][key]["inside"] = [];
                             }
                             result["queriesMore"][key]["inside"].push(element);
                         });
                         resolveEach();
                    });

                }

            });
        });
        if (meta) {
            await this.googleParseMeta(result).then(res => {
                console.log('meta_q END');
                this.finishAndSaveJson(result, data, callback);
            }); //init this.meta_q
        } else {
            this.finishAndSaveJson(result, data);
        }
    }
    finishAndSaveJson (result, data, callback) {
        fs.writeFile('./Javascript/Nodejs/googleParse/queries/'+data.query+data.n_start+'.json',
            JSON.stringify(result, null, 4),
            'utf8', (w_err, w_res) => {
                if (w_err) {
                    this.socket.emit('console',[w_err,'w_err']);
                    console.log(w_err,'w_err');
                    throw new w_err;
                }
                console.log(data.query,data.n_start, "JSON SAVE");
                this.socket.emit('console',[data.query,data.n_start, "JSON SAVE"]);
                if (callback) {
                    setTimeout(() => {
                        callback();
                    },this.requestPause);
                }
            });
    }
    googleParseQueries (result, href, n_inside, meta) {
        return new Promise((resolveLink, rejectLink) => {
            let url = "https://www.google.com"+encodeURI(href),
                queries = [];

            let meta_q = tress((url, callbackQueries) => {
                console.log(href, 'href',n_inside);
                needle.get(url, {}, (errIn, resIn) => { // { agent: myAgent },
                    if (errIn) {
                        console.log(errIn,'errIn');
                        this.socket.emit('console',[errIn,'errIn']);
                        return;
                    }
                    console.log('hrefStart',n_inside);
                    this.socket.emit('console',['Parsed Queries => ',url]);
                    if (meta) {
                        this.parseHtml(resIn.body, {
                            url: result["queriesMore"][n_inside].href,
                            query: result["queriesMore"][n_inside].title,
                            n_start: 0
                        }, null, false);

                        // this.requestGet({
                        //     url: result["queriesMore"][n_inside].href,
                        //     query: result["queriesMore"][n_inside].title,
                        //     n_start: 0
                        // }, null, false, resIn.body);
                    }

                    let $In = cheerio.load(resIn.body),
                        queriesIn = {};
                    $In('footer').remove();
                    $In('header').remove();
                    console.log('end2',n_inside)

                    $In('a').each((index, element) => {
                        let link = $In(element),
                            href = decodeURI(link.attr('href'));

                        if (href.indexOf("/search?") > -1 && link.hasClass("tHmfQe")) {
                            queriesIn = {
                                title: link.text(),
                                href: "https://google.com"+href,
                                html: link.html(),
                            };

                            console.log('In EACH',n_inside)

                            if (typeof queries[n_inside] === 'undefined') {
                                queries[n_inside] = [];
                            }
                            queries[n_inside].push(queriesIn);

                        }
                    });

                    console.log('end3',n_inside);
                    setTimeout(()=> {
                        callbackQueries();
                    },this.requestPause);
                });
            },this.threads);

            meta_q.push(url);
            meta_q.drain = () => {
                resolveLink(queries);
            }
        })

    }
    googleParseMeta (query_json) {
        return new Promise((resolve,reject) => {
            let meta_q = tress((urlMeta, callbackMeta) => {
                needle.get(urlMeta.href, (errMeta, resMeta) => { // { agent: myAgent },
                    if (errMeta) {
                        console.log(errMeta,'errMeta');
                        // reject(errMeta);
                        // this.socket.emit('console',[errMeta,'errMeta']);
                        callbackMeta();
                        return;
                    }
                    this.socket.emit('console',['Parsed Meta => ',urlMeta.href]);
                    let $ = cheerio.load(resMeta.body);
                    urlMeta.meta = {
                        title: $("head title").text(),
                        description: $("meta[name='description']").attr("content"),
                        keywords: $("meta[name='keywords']").attr("content"),
                        h1: $('h1').text()
                    };
                    console.log("googleParseMeta END");
                    callbackMeta();
                });
            },5);
            query_json["googleSearch"].forEach(site => {
                if (Object.keys(site).indexOf('meta') === -1) {
                    meta_q.push(site);
                }
            });
            meta_q.drain = () => {
                resolve();
            }
        })
    }
    getGoogle (urls) {
        if (urls.indexOf("") !== -1) {
            console.log('return');
            this.socket.emit('console',['return']);
            return;
        }
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
