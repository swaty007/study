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

var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : 'swaty.mysql.tools',
    database : 'swaty_googlepars',
    user     : 'swaty_googlepars',
    password : 'o5a_KsA9_1',
});
// var pool = mysql.createPool({
//     host     : 'swaty.mysql.tools',
//     database : 'swaty_googlepars',
//     user     : 'swaty_googlepars',
//     password : 'o5a_KsA9_1',
// });


// sockets
// const app = require('express')(),
//     server = require('http').Server(app),
//     io = require('socket.io')(server);
// server.listen(3038);

class Parser {
    constructor() {
        this.results = [];
        this.totalRequest = {
            google: 0,
            sites: 0,
            cached: 0
        };
        this.threads = 1;
        this.sites = {};
        this.queries = [];
        this.html_cache_time = 24;
        this.requestPause = 1500;
        this.socket = "";

        // io.sockets.on('connection', (socket) => {
        //     this.socket = socket;
        //     console.log('connect');
        //     this.socket.on('getGoogle', (result) => {
        //         console.log(result,'result getGoogle Back');
        //         this.parseHtml(result.res.body, result.data, result.cb);
        //     });
        // });
    }
    setSocket (socket) {
        return new Promise( (resolve, reject) => {
            // io.on('connection', (socket) => {
                this.socket = socket;
                this.socket.emit('console',["TEST CONNECT"]);
                console.log('connect');
                socket.on('disconnect', () => {
                    console.log('disconnect');
                    // connection.end((err) => {
                        // The connection is terminated now
                    //     console.log("MySQL connect end ", err);
                    // });
                });
                resolve();
                // this.socket.on('getGoogle', (result) => {
                    // console.log(result,'result getGoogle Back');
                    // this.parseHtml(result.res.body, result.data, result.cb);
                // });
            // });
        });
    }
    initGoogle() {
        this.size = 1; //x10
        this.sites = {};
        this.queries = [];
        this.totalRequest = {
            google: 0,
            sites: 0,
            cached: 0
        };

        this.promise = new Promise((resolve, reject) => {
            this.q = tress((data, callback) => {
                this.requestGet(data, callback);
            }, this.threads);
            this.q.drain = () => {
                console.log('Total Request = ',this.totalRequest);
                this.socket.emit('console',['Total Request = ', this.totalRequest]);
                resolve({
                    sites: this.sites,
                    queries: this.queries
                });
            }
        });
    }
    requestGet (data, callback, meta = true, parent = undefined) {
        var proxy = {
            agent: myAgent,
        };

        connection.query(`SELECT * FROM swaty_googlepars.sites WHERE name = ?`,
            [data.query+data.n_start],
            async (mysql_find_error, result, fields) => {
                if (mysql_find_error) {
                    console.log(mysql_find_error,'mysql_find_error');
                    this.socket.emit('console',[mysql_find_error,'mysql_find_error']);
                    throw mysql_find_error;
                }
                if (result.length > 0 && this.html_cache_time > (Date.now() - result[0].timestamp)/(1000*60*60)) {
                    await this.loadHtml(JSON.stringify({queriesMore: JSON.parse(result[0].queries), googleSearch: JSON.parse(result[0].search)}), data, meta, parent).then(() => {
                        console.log(data.query, data.n_start, "JSON LOAD");
                        this.socket.emit('console',[data.query, data.n_start, "JSON LOAD"]);
                        this.totalRequest.cached += 1;
                        if (meta) {
                            callback();
                        } else {
                            callback({queriesMore:result[0].queries, googleSearch: result[0].search});
                        }
                    });
                } else {
                    console.log('error_stats or cache_time',data.query+data.n_start);
                    this.socket.emit('console',['error_stats or cache_time',data.query+data.n_start]);
                    needle.get(data.url, {},(err, res) => { // { agent: myAgent },
                        this.totalRequest.google += 1;
                        if (err) {
                            console.log(err,'err', data.url);
                            this.socket.emit('console',[err,'err']);
                            if (callback) {
                                callback();
                            }
                            return;
                        }
                        // fs.writeFile('./Javascript/Nodejs/googleParse/queries/'+data.query+data.n_start+'.html', res.body, 'utf8');
                        this.parseHtml (res.body, data, callback, meta, parent);
                    });

                }
            });
        return;
        fs.stat('./Javascript/Nodejs/googleParse/queries/'+data.query+data.n_start+'.json',(error_stats, stats) => {
            if ( error_stats || (Date.now() - stats.mtimeMs)/(1000*60*60) > this.html_cache_time) { //!meta ||
                if (error_stats != null) {
                    console.log('error_stats or cache_time',error_stats.path,error_stats.code);
                    this.socket.emit('console',['error_stats or cache_time',error_stats.path,error_stats.code]);
                    if (error_stats.code == "ENAMETOOLONG") {
                        console.log("EXIT FROM ERROR")
                        if (callback) {
                            callback();
                        }
                        return;
                    }
                }
                // this.socket.emit('getGoogle', { data: data, cb: callback });
                    needle.get(data.url, {},(err, res) => { // { agent: myAgent },
                        this.totalRequest.google += 1;
                        if (err) {
                            console.log(err,'err', data.url);
                            this.socket.emit('console',[err,'err']);
                            if (callback) {
                                callback();
                            }
                            return;
                        }
                        // fs.writeFile('./Javascript/Nodejs/googleParse/queries/'+data.query+data.n_start+'.html', res.body, 'utf8');
                        this.parseHtml (res.body, data, callback, meta, parent);
                    });
                return;
            }
            fs.readFile('./Javascript/Nodejs/googleParse/queries/'+data.query+data.n_start+'.json','utf8',  async (error, contentJson) => {
                if (error) {
                    console.log(error, "error");
                    this.socket.emit('console',[error, "error"]);
                    return;
                    // throw new error;
                }
                await this.loadHtml(contentJson, data, meta, parent).then(() => {
                    console.log(data.query, data.n_start, "JSON LOAD");
                    this.socket.emit('console',[data.query, data.n_start, "JSON LOAD"]);
                    this.totalRequest.cached += 1;
                    if (meta) {
                        callback();
                    } else {
                        callback(contentJson);
                    }
                });
            });
        });
    }
    loadHtml (json, data, meta = true, parent = undefined) {
        return new Promise(async (resolve, reject) => {
            JSON.parse(json)["googleSearch"].forEach( site => {
                if (meta) {
                    if (typeof this.sites[site.domain] === 'undefined') {
                        this.sites[site.domain] = [];
                    }
                    this.sites[site.domain].push(site);
                }
            });
            let queriesParent = {
                parent: "1st Level",
                name: data.query,
                children: []
            };
            if (parent === undefined) {
                this.queries.push(queriesParent);
            }
            let parsedJson = JSON.parse(json),
             total = parsedJson["queriesMore"].length - 1;
            JSON.parse(json)["queriesMore"].forEach((queries, index) => {
                let copyResult = Object.assign({}, queries);
                copyResult.name = copyResult.title;
                if (parent !== undefined) {
                    if (typeof parent["children"] === 'undefined') {
                        parent["children"] = [];
                    }
                    copyResult.parent = parent.name;
                    parent["children"].push(copyResult);
                    if (index === total) {
                        setTimeout(()=>{
                            resolve();
                        }, this.requestPause);
                    }
                } else {
                    copyResult.parent = data.query;
                    queriesParent.children.push(copyResult);
                    if (meta) {
                        this.googleParseQueries(parsedJson, index, copyResult).then(resolveQuery => {
                            // JSON.parse(resolveQuery)["queriesMore"].forEach((element, key) => {
                            //     // if (typeof result["queriesMore"][key]["children"] === 'undefined') {
                            //     //     result["queriesMore"][key]["children"] = [];
                            //     // }
                            //     // result["queriesMore"][key]["children"].push(element);
                            //     result["queriesMore"][key]["children"] = element;
                            // });
                            //  console.log("PARSE QUERIES N", n_inside);
                             if (index === total) {
                                 resolve();
                             }
                        });
                    } else {
                        if (index === total) {
                            setTimeout(()=>{
                                resolve();
                            }, this.requestPause);
                        }
                    }
                }
            });

        });
    }
    async parseHtml (html, data, callback, meta = true, parent = undefined) {
        let $ = cheerio.load(html),
            sites = {},
            queries = {},
            queriesParent = {
            parent: "1st Level",
                name: data.query,
                children: []
            },
            result = {
                queriesMore: [],
                googleSearch: []
            },
            n = data.n_start,
            n_inside = -1;

        if (parent === undefined) {
            this.queries.push(queriesParent);
        }

        $('footer').remove();
        $('header').remove();
        await new Promise( async (resolveAeach, rejectAeach) => {
            let total = $('a').length - 1;

            $('a').each( async (index, element) => {
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
                        if (index === total) {
                            setTimeout(()=>{
                                resolveAeach();
                            }, this.requestPause);
                        }
                        resolveEach();
                    } else if (href.indexOf("/search?") > -1 && link.hasClass("tHmfQe")) {
                        queries = {
                            title: link.text(),
                            // name: link.text(),
                            href: href.indexOf("https://www.google.com") > -1 ? href : "https://www.google.com"+href,
                            // parent: "null",
                            // html: link.html()
                        };
                        result["queriesMore"].push(queries);
                        let copyResult = Object.assign({}, queries);
                        copyResult.name = copyResult.title;

                        if (parent !== undefined) {
                            if (typeof parent["children"] === 'undefined') {
                                parent["children"] = [];
                            }
                            copyResult.parent = parent.name;
                            parent["children"].push(copyResult);
                        } else {
                            // copyResult.parent = "1st Level";
                            copyResult.parent = data.query;
                            queriesParent.children.push(copyResult);
                            // queriesParent.push(copyResult);
                        }


                        console.log('end1',n_inside);

                        // await googleParseQueries();
                        n_inside++;
                        if (meta) {
                            await this.googleParseQueries(result,n_inside,copyResult).then(resolveQuery => { //тут передается родитель самая основа
                               // JSON.parse(resolveQuery)["queriesMore"].forEach((element, key) => {
                               //     // if (typeof result["queriesMore"][key]["children"] === 'undefined') {
                               //     //     result["queriesMore"][key]["children"] = [];
                               //     // }
                               //     // result["queriesMore"][key]["children"].push(element);
                               //     result["queriesMore"][key]["children"] = element;
                               // });
                               //  console.log("PARSE QUERIES N", n_inside);
                                   if (index === total) {
                                       resolveAeach();
                                   }
                                resolveEach();
                           });
                        } else {
                            if (index === total) {
                                setTimeout(()=>{
                                    resolveAeach();
                                }, this.requestPause);
                            }
                            resolveEach();
                        }

                    } else {
                        if (index === total) {
                            setTimeout(()=>{
                                resolveAeach();
                            }, this.requestPause);
                        }
                        resolveEach();
                    }
                });
            });
        }).then(async (resAeach) => {
            // if (meta) {
                await this.googleParseMeta(result); //init this.meta_q
                // await this.googleParseQueries()
                console.log('meta_q END');
                // this.queries = result["queriesMore"];
                this.finishAndSaveJson(result, data, callback, meta);
            // } else {
            //     this.finishAndSaveJson(result, data, callback, meta);
            // }
        });
    }
    finishAndSaveJson (result, data, callback, meta = true) {
        connection.query(`REPLACE INTO swaty_googlepars.sites SET ?`,
            {name: data.query+data.n_start, queries: JSON.stringify(result.queriesMore), search: JSON.stringify(result.googleSearch), timestamp: Date.now()},
             (mysql_save_error, results, fields) => {
            if (mysql_save_error) {
                console.log(mysql_save_error,'mysql_save_error');
                this.socket.emit('console',[mysql_save_error,'mysql_save_error']);
                // throw mysql_save_error;
            }
            // console.log("resultsSave = ", results);
            // console.log("fieldsSave = ", fields);

                console.log(data.query,data.n_start, "JSON SAVE");
                this.socket.emit('console',[data.query,data.n_start, "JSON SAVE"]);
                if (callback) {
                    setTimeout(() => {
                        if (meta) {
                            callback();
                        } else {
                            callback(result);
                        }
                    },this.requestPause);
                }
        });
        return;
        fs.writeFile('./Javascript/Nodejs/googleParse/queries/'+data.query+data.n_start+'.json',
            JSON.stringify(result, null, 4),
            'utf8', (w_err, w_res) => {
                if (w_err) {
                    this.socket.emit('console',[w_err,'w_err']);
                    console.log(w_err,'w_err');
                    // return;
                    // throw new w_err;
                }
                console.log(data.query,data.n_start, "JSON SAVE");
                this.socket.emit('console',[data.query,data.n_start, "JSON SAVE"]);
                if (callback) {
                    setTimeout(() => {
                        if (meta) {
                            callback();
                        } else {
                            callback(result);
                        }
                    },this.requestPause);
                }
            });
    }
    googleParseQueries (result, n_inside, parent = undefined) {
        return new Promise(async (resolve, reject) => {
            await new Promise((resolveLink, rejectLink) => {

                this.requestGet({
                    url: encodeURI(result["queriesMore"][n_inside].href),
                    query: result["queriesMore"][n_inside].title,
                    n_start: 0
                }, resolveLink, false, parent);
            }).then( resLink => {
                // console.log("PARSE QUERIES N INSIDE", n_inside);
                resolve(resLink);
            });
        })
    }
    googleParseMeta (query_json) {
        return new Promise((resolve,reject) => {
            let meta_q = tress((urlMeta, callbackMeta) => {
                needle.get(urlMeta.href, (errMeta, resMeta) => { // { agent: myAgent },
                    this.totalRequest.sites += 1;
                    if (errMeta) {
                        console.log(errMeta,'errMeta');
                        // reject(errMeta);
                        // this.socket.emit('console',[errMeta,'errMeta']);
                        callbackMeta();
                        return;
                    }
                    // this.socket.emit('console',['Parsed Meta => ',urlMeta.href]);
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
                this.socket.emit('console',['Parsed Meta END => ', query_json["googleSearch"]]);
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
