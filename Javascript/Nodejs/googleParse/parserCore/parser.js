const tress = require('tress'),
    needle = require('needle'),
    cheerio = require('cheerio'),
    // resolve = require('url').resolve,
    fs = require('fs'),
    tunnel = require('tunnel'),
    {performance} = require('perf_hooks'),
    {Domains}  = require('./parseDomains');

var myAgent = tunnel.httpsOverHttp({
    proxy: {
        host: '95.38.209.126',
        port: 80, // Defaults to 443
    }
});
const mysql    = require('mysql'),
    connection = mysql.createConnection({
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
        this.threads = 5;
        this.sites = {};
        this.queries = [];
        this.html_cache_time = 24;
        this.requestPause = 100;
        this.socket = "";
        this.domainsParser = new Domains();

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
    initGoogle(data) {
        this.size = data.size; //1x10
        this.sites = {};
        this.queries = [];
        this.domains = {};
        this.totalRequest = {
            google: 0,
            sites: 0,
            cached: 0,
            time: 0,
            timeDomain: 0,
            domains: 0,
        };

        let Google = new Promise((resolve, reject) => {
            console.time("Google Work");
            this.totalRequest.time = performance.now();
            this.q = tress((data, callback) => {
                this.requestGetSql(data, callback);
                // this.requestGetJson(data, callback);
            }, this.threads);
            this.q.drain = () => {
                console.timeEnd("Google Work");
                this.totalRequest.time = performance.now() - this.totalRequest.time;
                this.socket.emit('getGoogle', JSON.stringify({
                    sites: this.sites,
                    queries: this.queries
                }) );
                resolve();
            }
        });
        let Ads = new Promise((resolve, reject) => {
            resolve();
        });
        let Domain = new Promise((resolve,reject) => {
            console.time("Domain Work");
            this.totalRequest.timeDomain = performance.now();
            this.d = tress((data, callback) => {
                this.getDomain(data, callback);
            }, this.threads);
            this.d.drain = () => {
                console.timeEnd("Domain Work");
                this.totalRequest.timeDomain = performance.now() - this.totalRequest.timeDomain;
                this.socket.emit('getDomains', JSON.stringify({
                    domains: this.domains
                }) );
                resolve();
            }
        });
        this.promise = new Promise((resolve,reject) => {
            Promise.all([Google, Ads, Domain]).then( res => {

                for (var request in this.totalRequest) {
                    if( this.totalRequest.hasOwnProperty( request ) ) {
                        connection.query(`UPDATE swaty_googlepars.admin_settings SET value = value + ? WHERE name = ?`,
                            [ this.totalRequest[request], request],
                            (mysql_error, results, fields) => {
                                if (mysql_error) {
                                    console.log(mysql_error,'mysql_save_error');
                                    this.socket.emit('console',[mysql_error,'mysql_error']);
                                    // throw mysql_save_error;
                                }
                            });
                    }
                }

                console.log('Total Request = ', this.totalRequest);
                this.socket.emit('console',['Total Request = ', this.totalRequest]);

                resolve({
                    sites: this.sites,
                    queries: this.queries,
                    domains: this.domains,
                });
            });
        });
    }
    requestGetSql (data, callback) {
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
                    await this.loadHtml(JSON.stringify({queriesMore: JSON.parse(result[0].queries), googleSearch: JSON.parse(result[0].search)}), data).then(() => {
                        console.log(data.query, data.n_start, "SQL LOAD");
                        this.socket.emit('console',[data.query, data.n_start, "SQL LOAD"]);
                        this.totalRequest.cached += 1;
                        if (callback) {
                            if (data.meta) {
                                callback();
                            } else {
                                callback({queriesMore:result[0].queries, googleSearch: result[0].search});
                            }
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
                        this.parseHtml (res.body, data, callback);
                    });

                }
            });
    }
    requestGetJson (data, callback) {
        var proxy = {
            agent: myAgent,
        };

        fs.stat('./Javascript/Nodejs/googleParse/queries/'+data.query+data.n_start+'.json',(error_stats, stats) => {
            if ( error_stats || (Date.now() - stats.mtimeMs)/(1000*60*60) > this.html_cache_time) { //!meta ||
                if (error_stats != null) {
                    console.log('error_stats or cache_time',error_stats.path,error_stats.code);
                    this.socket.emit('console',['error_stats or cache_time',error_stats.path,error_stats.code]);
                    if (error_stats.code == "ENAMETOOLONG") {
                        console.log("EXIT FROM ERROR");
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

                        // fs.writeFile('./Javascript/Nodejs/googleParse/queries/'+data.query+data.n_start+'.html', res.body, 'utf8', (w_err, w_res) => {
                        //     if (w_err) {
                        //         this.socket.emit('console',[w_err,'w_err']);
                        //         console.log(w_err,'w_err');
                        //     }
                        // });

                        this.parseHtml (res.body, data, callback);
                    });
                return;
            }
            fs.readFile('./Javascript/Nodejs/googleParse/queries/'+data.query+data.n_start+'.json','utf8',  async (error, contentJson) => {
                if (error) {
                    console.log(error, "error");
                    this.socket.emit('console',[error, "error"]);
                    if (callback) {
                        callback();
                    }
                    return;
                    // throw new error;
                }
                await this.loadHtml(contentJson, data).then(() => {
                    console.log(data.query, data.n_start, "JSON LOAD");
                    this.socket.emit('console',[data.query, data.n_start, "JSON LOAD"]);
                    this.totalRequest.cached += 1;
                    if (callback) {
                        if (data.meta) {
                            callback();
                        } else {
                            callback(contentJson);
                        }
                    }
                });
            });
        });
    }
    loadHtml (json, data) {
        return new Promise(async (resolve, reject) => {
            JSON.parse(json)["googleSearch"].forEach(async site => {
                if (data.meta) {
                    if (typeof this.sites[site.domain] === 'undefined') {
                        this.sites[site.domain] = [];
                        this.d.push(site.domain);
                    }
                    this.sites[site.domain].push(site);
                }
            });
            if (data.n_start === 0) {
                let queriesParent = {
                    parent: "1st Level",
                    name: data.query,
                    children: []
                };
                if (data.parent === undefined) {
                    this.queries.push(queriesParent);
                }
                let parsedJson = JSON.parse(json),
                    total = parsedJson["queriesMore"].length - 1;
                if (JSON.parse(json)["queriesMore"].length === 0) {
                    resolve();
                    return;
                }
                JSON.parse(json)["queriesMore"].forEach((queries, index) => {
                    let copyResult = Object.assign({}, queries);
                    copyResult.name = copyResult.title;
                    if (data.parent !== undefined) {
                        if (typeof data.parent["children"] === 'undefined') {
                            data.parent["children"] = [];
                        }
                        copyResult.parent = data.parent.name;
                        data.parent["children"].push(copyResult);
                        if (index === total) {
                            resolve();
                        }
                    } else {
                        copyResult.parent = data.query;
                        queriesParent.children.push(copyResult);
                        if (data.meta) {
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
                                resolve();
                            }
                        }
                    }
                });
            } else {
                resolve();
            }


        });
    }
    async parseHtml (html, data, callback) {
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

        if (data.parent === undefined && data.n_start === 0) {
            this.queries.push(queriesParent);
        }

        $('footer').remove();
        $('header').remove();
        await new Promise( async (resolveA_Each, rejectAeach) => {
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
                            if (index === total) {
                                resolveA_Each();
                            }
                            resolveEach();
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
                        if (typeof this.sites[domain] === 'undefined' && data.meta) {
                            this.sites[domain] = [];
                            this.d.push(domain);
                        }
                        if (data.meta) {
                            this.sites[domain].push(sites);
                        }

                        // this.sites[domain] = Object.assign(this.sites[domain], sites);
                        n++;
                        if (index === total) {
                            resolveA_Each();
                        }
                        resolveEach();
                    } else if (href.indexOf("/search?") > -1 &&
                        link.hasClass("tHmfQe") &&
                        link.closest(".ZINbbc").children(".kCrYT").find("span.FCUp0c").length !== 0 &&
                        data.n_start === 0) {
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

                        if (data.parent !== undefined) {
                            if (typeof data.parent["children"] === 'undefined') {
                                data.parent["children"] = [];
                            }
                            copyResult.parent = data.parent.name;
                            data.parent["children"].push(copyResult);
                        } else {
                            // copyResult.parent = "1st Level";
                            copyResult.parent = data.query;
                            queriesParent.children.push(copyResult);
                            // queriesParent.push(copyResult);
                        }


                        // console.log('end1',n_inside);

                        // await googleParseQueries();
                        n_inside++;
                        if (data.meta) {
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
                                       resolveA_Each();
                                   }
                                resolveEach();
                           });
                        } else {
                            if (index === total) {
                                resolveA_Each();
                            }
                            resolveEach();
                        }

                    } else {
                        if (index === total) {
                            resolveA_Each();
                        }
                        resolveEach();
                    }
                });
            });
        }).then(async (resAeach) => {
            // if (meta) {
                await this.googleParseMeta(result); //init this.meta_q
                // await this.googleParseQueries()
                // console.log('meta_q END');
                // this.queries = result["queriesMore"];
                this.finishAndSaveSql(result, data, callback);
                // this.finishAndSaveJson(result, data, callback);
            // } else {
            //     this.finishAndSaveJson(result, data, callback, meta);
            // }
        });
    }
    googleParseQueries (result, n_inside, parent = undefined) {
        return new Promise(async (resolve, reject) => {
            // await new Promise((resolveLink, rejectLink) => {

                this.q.push({
                    url: encodeURI(result["queriesMore"][n_inside].href),
                    query: result["queriesMore"][n_inside].title,
                    n_start: 0,
                    callback: undefined,
                    meta: false,
                    parent: parent
                });
                // resolveLink()
                // this.requestGetSql({
                //     url: encodeURI(result["queriesMore"][n_inside].href),
                //     query: result["queriesMore"][n_inside].title,
                //     n_start: 0,
                //     meta: false,
                //     parent: parent,
                // }, resolveLink);
            // }).then( resLink => {
                // console.log("PARSE QUERIES N INSIDE", n_inside);
                resolve();//resolve(resLink);
            // });
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
                    this.socket.emit('console',['Parsed Meta => ',urlMeta.href]);
                    let $ = cheerio.load(resMeta.body);
                    urlMeta.meta = {
                        title: $("head title").text(),
                        description: $("meta[name='description']").attr("content"),
                        keywords: $("meta[name='keywords']").attr("content"),
                        h1: $('h1').text()
                    };
                    // console.log("googleParseMeta END");
                    callbackMeta();
                });
            },10);
            if (query_json["googleSearch"].length === 0) {
                resolve();
            }
            query_json["googleSearch"].forEach(site => {
                if (Object.keys(site).indexOf('meta') === -1) {
                    meta_q.push(site);
                }
            });
            meta_q.drain = () => {
                // this.socket.emit('console',['Parsed Meta END => ', query_json["googleSearch"]]);
                resolve();
            }
        })
    }
    async getDomain(domain, cb) {

        connection.query(`SELECT * FROM swaty_googlepars.domains WHERE domain = ?`,
            [domain],
            async (mysql_find_error, result, fields) => {
                if (mysql_find_error) {
                    console.log(mysql_find_error,'mysql_find_error');
                    this.socket.emit('console',[mysql_find_error,'mysql_find_error']);
                    throw mysql_find_error;
                }
                if (result.length > 0 && this.html_cache_time > (Date.now() - result[0].timestamp)/(1000*60*60)) {
                    let available = result[0].available;
                    if (available === -1) {
                        this.domains[domain] = false;
                    } else {
                        this.domains[domain] = {
                            status: !!result[0].available,
                            price: result[0].price
                        }
                    }
                    console.log(domain, "SQL DOMAIN LOAD");
                    this.socket.emit('console',[domain, "SQL DOMAIN LOAD"]);

                    this.socket.emit('getDomain', JSON.stringify({
                        [domain]: this.domains[domain]
                    }) );

                    this.totalRequest.cached += 1;
                    if (this.d.length() <= this.threads) {
                        setTimeout(()=>{
                            cb();
                        },2000);
                    } else {
                        cb();
                    }

                } else {
                    console.log('error_stats or cache_time Domain', domain);
                    this.socket.emit('console',['error_stats or cache_time Domain', domain]);

                    await this.domainsParser.parse(domain).then(status => {
                        this.totalRequest.domains += 1;
                        this.domains[domain] = status;

                        this.socket.emit('getDomain', JSON.stringify({
                            [domain]: this.domains[domain]
                        }) );

                        let sql = {};
                        if (status) {
                            sql = {domain: domain, available: status.available ? 1 : 0, price: status.price, timestamp: Date.now()};
                        } else {
                            sql = {domain: domain, available: -1, price: " ", timestamp: Date.now()};
                        }
                            connection.query(`REPLACE INTO swaty_googlepars.domains SET ?`,
                                sql,
                                (mysql_save_error, results, fields) => {
                                    if (mysql_save_error) {
                                        console.log(mysql_save_error,'mysql_save_error');
                                        this.socket.emit('console',[mysql_save_error,'mysql_save_error']);
                                        // throw mysql_save_error;
                                    }

                                    console.log(domain, "SQL DOMAIN SAVE");
                                    this.socket.emit('console',[domain, "SQL DOMAIN SAVE"]);
                                    if (this.d.length() <= this.threads) {
                                        setTimeout(()=>{
                                            cb();
                                        },2000);
                                    } else {
                                        cb();
                                    }
                                });

                    });

                }
            });

    }
    finishAndSaveSql (result, data, callback) {
        if (result.queriesMore.length === 0 && result.googleSearch.length === 0) {
            console.log('0 data');
            if (callback) {
                setTimeout(() => {
                    if (data.meta) {
                        callback();
                    } else {
                        callback();//callback(result);
                    }
                },this.requestPause);
            }
            return;
        }
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

                console.log(data.query,data.n_start, "SQL SAVE");
                this.socket.emit('console',[data.query,data.n_start, "SQL SAVE"]);
                if (callback) {
                    setTimeout(() => {
                        if (data.meta) {
                            callback();
                        } else {
                            callback(result);
                        }
                    },this.requestPause);
                }
            });
    }
    finishAndSaveJson (result, data, callback) {
        if (result.queriesMore.length === 0 && result.googleSearch.length === 0) {
            console.log('0 data');
            if (callback) {
                setTimeout(() => {
                    if (data.meta) {
                        callback();
                    } else {
                        callback(result);
                    }
                },this.requestPause);
            }
            return;
        }
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
                        if (data.meta) {
                            callback();
                        } else {
                            callback();//callback(result);
                        }
                    },this.requestPause);
                }
            });
    }
    getGoogle (data) {

        let sites = data.sites.split(/,|\n/).map(site => site.trim());
        if (sites.indexOf("") !== -1 || data.size > 5 || data.size < 1) {
            console.log('return');
            this.socket.emit('console',['return']);
            return;
        }
        this.initGoogle(data);
        sites.forEach(i => {
            for (let n = 0; n < this.size; n++) {
                let url = encodeURI(`https://www.google.com.ua/search?hl=ru&source=hp&q=${i}&oq=${i}`);
                if (n > 0) {
                    url += '&start='+String(n*10)
                }
                this.q.push({
                    url: url,
                    query: i,
                    n_start: n*10,
                    callback: undefined,
                    meta: true,
                    parent: undefined
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
