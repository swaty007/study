// gconf-service libasound2 libatk1.0-0 libatk-bridge2.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget
const cheerio = require('cheerio'),
    tress = require('tress'),
    needle = require('needle'),
    fs = require('fs'),
    // axios = require('axios'),
    request = require('request'),
    {performance} = require('perf_hooks'),
    path = require('path');


require('events').EventEmitter.defaultMaxListeners = 0;
// console.log(require('events').EventEmitter.defaultMaxListeners)
// console.log(process)


const {Worker, isMainThread, workerData, parentPort} = require('worker_threads');


class ScreenShot {
    constructor() {
        this.types = {
            prnt: "prnt",
            joxi: "joxi",
            screencapture: "screencapture",
            imgur: "imgur",
        };
        this.stop = {
            prnt: false,
            joxi: false,
            screencapture: false,
            imgur: false,
        };
        this.totalRequest = {
            site: 0,
            img: 0,
            time: 0,
        };
        this.threads = 3;
        this.totalRequest.time = performance.now();
        this.init();
    }

    async init() {
        // try {
        //     this.parsePrnt();
        // } catch (e) {
        //     console.log('Error init', e);
        //     this.parsePrnt();
        // }
        // try {
        //     this.parseJoxi();
        // } catch (e) {
        //     console.log('Error init', e);
        //     this.parseJoxi();
        // }

        new Promise((resolve, reject) => {
            console.time("Brute Work");
            this.parse = tress((data, callback) => {
                this.parsePrnt(data, callback);
                this.parseJoxi(data, callback);
                this.parseScreencapture(data, callback);
                this.parseImgur(data, callback);
            }, this.threads);
            this.parse.drain = () => {
                console.timeEnd("Brute Work");
                resolve();
            };
            for (let i = 0; i < this.threads; i++) {
                this.parse.push({});
            }

        });
    }

    async parsePrnt() {
        do {
            await Promise.all([
                this.getImg(this.generateLink(5), this.types.prnt),
                this.getImg(this.generateLink(6), this.types.prnt),
            ]);
        } while (this.stop.prnt === false);
        console.log('Prnt Stop');
    }

    async parseJoxi() {
        do {
            await this.getImg(this.generateLink(14, true), this.types.joxi);
        } while (this.stop.joxi === false);
        console.log('Joxi Stop');
    }
    async parseScreencapture() {
        do {
            await this.getImg(this.generateLink(8, true), this.types.screencapture);
        } while (this.stop.screencapture === false);
        console.log('ScreenCapture Stop');
    }
    async parseImgur() {
        do {
            await this.getImg(this.generateLink(7, true), this.types.imgur);
        } while (this.stop.imgur === false);
        console.log('Imgur Stop');
    }

    async getImg(url, type) {
        return new Promise(async (resolve, reject) => {
            switch (type) {
                case this.types.prnt:
                    url = "https://prnt.sc/"+url;
                    break;
                case this.types.joxi:
                    url = "http://joxi.net/"+url;
                    break;
                case this.types.screencapture:
                    url = "https://www.screencapture.ru/file/"+url;
                    break;
                case this.types.imgur:
                    url = "https://imgur.com/"+url;
                    break;
                default:
                    throw new Error('Bad type');
            }
            needle.get(url, {}, (err, res) => {
                if (err) {
                    console.log('err', err);
                    resolve();
                    return;
                }
                this.totalRequest.site += 1;
                // console.log('img =',this.totalRequest.img, ' site =',this.totalRequest.site);
                if (res.statusCode === 403) {
                    this.stop[type] = true;
                    resolve();
                    return;
                }
                console.log(res.statusCode, this.totalRequest.site, url);
                if (res.statusCode === 404) {
                    resolve();
                    return;
                }
                // console.log(res.body);
                // console.log(url);
                let $ = cheerio.load(res.body),
                    img = '';
                    switch (type) {
                        case this.types.prnt:
                            img = $("#screenshot-image").attr('src');
                            break;
                        case this.types.joxi:
                            img = $(".tile-wrapper .tile-image img").attr('src');
                            break;
                        case this.types.screencapture:
                            img = $("#image_thumb").attr('src');
                            break;
                        case this.types.imgur:
                            img = $("link[rel=image_src]").attr('href');
                            break;
                        default:
                            throw new Error('Bad type');
                    }
                // console.log(img);
                if (img === undefined) {
                    resolve();
                    return;
                }
                let filename = img.split('/').pop();


                fs.stat(`./Javascript/Nodejs/imgParse/parsedimg/${type}/${filename}`, (error_stats, stats) => {
                    if (error_stats != null) {
                        // console.log('error_stats', error_stats.path, error_stats.code);
                        if (error_stats.code == "ENAMETOOLONG") {
                            console.log("EXIT FROM ERROR");
                            resolve();
                            return;
                        }
                        // console.log('write file',filename);
                        let imgUrl = "";
                        if (img.indexOf('http') >= 0) {
                            imgUrl = img;
                        } else {
                            imgUrl = img.replace("//", 'https://');
                        }
                        if (imgUrl.indexOf('.png') !== -1 ||
                            imgUrl.indexOf('.jpg') !== -1 ||
                            imgUrl.indexOf('.jpeg') !== -1 ||
                            imgUrl.indexOf('.svg') !== -1) {
                            try {
                                let stream = request(imgUrl);
                                stream.on('error', (e) => {
                                    console.log('error1', e, 'img=', imgUrl);
                                    resolve();
                                }).pipe(fs.createWriteStream(`./Javascript/Nodejs/imgParse/parsedimg/${type}/${filename}`)
                                    .on('finish', () => {
                                        this.totalRequest.img += 1;
                                        console.log('img =',this.totalRequest.img, ' site =',this.totalRequest.site);
                                        // if (this.totalRequest.img == 100) {
                                        // console.log(this.totalRequest.time = performance.now() - this.totalRequest.time);
                                        // 112530.05260109901
                                        // 46761.85130095482 5 threads and + ban
                                        // }
                                        resolve();
                                    })
                                    .on('error', (e) => {
                                        console.log('error2', e, 'img=', imgUrl);
                                        resolve();
                                    })
                                );
                            } catch (e) {
                                console.log('catch1', e, 'img=', imgUrl);
                                resolve();
                            }
                            return;
                        } else {
                            resolve();
                        }
                    }
                    resolve();
                });
            });
        })
    }

    generateLink(length = 14, big_chars = false, special_chars = false, extra_special_chars = false) {//joxi 14, prnt 5-6
        let chars = 'abcdefghijklmnopqrstuvwxyz0123456789',
            link = "";
        function randomInt(max) {
            return Math.floor(Math.random() * Math.floor(max));
        }
        if (big_chars) {
            chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        }
        if (special_chars) {
            chars += '!@#$%^&*()';
        }
        if (extra_special_chars) {
            chars += '-_ []{}<>~`+=,.;:/?|';
        }
        for (let i = 0; i < length; i++) {
            link += chars.substr(randomInt(chars.length), 1);
        }
        return link;

        // var chars = [];
        // const neededLength = 6;
        // const getCombinations = sequence => {
        //     if (sequence.length = neededLength) return [sequence];
        //     return chars
        //         .map(char => getCombinations(sequence + char)
        //             .reduce((combinations, current) => [...combinations, ...current], []);
        // }
        //
        //
        //
        // const basis = 36;
        // const maxNumber = parseInt('zzzzzz', basis);

        // const next = str => {
        //     const value = parseInt(str, basis);
        //     const nextValue = value + 1;
        //     return nextValue.toString(basis);
        // }

    }


    runWorker(path, cb, workerData) {
        const worker = new Worker(path, {workerData});

        worker.on('message', cb.bind(null, null));
        worker.on('error', cb);

        worker.on('exit', (exitCode) => {
            if (exitCode === 0) {
                return null;
            }

            return cb(new Error(`Worker has stopped with code ${exitCode}`));
        });

        return worker;
    }

}

// let testData = 0;
// if(isMainThread) {
//     testData += 1;
//     console.log("this is the main thread", testData, workerData);
//     for(let i = 0; i < 2; i++) {
//         let w = new Worker(__filename, {workerData: testData});
//         w.on('message', (msg) => { //Сообщение от воркера!
//             console.log("Сообщение от воркера: ", msg);
//         })
//         w.on('error', (error) => {
//             console.log("worker error", error);
//         });
//         w.on('exit', (code) => {
//             if(code != 0)
//                 console.error(new Error(`Worker stopped with exit code ${code}`))
//         });
//     }
//
//     try {
//         // let screenShot = new ScreenShot();
//     } catch (e) {
//         console.log(e, 'errorMainScript');
//     }
//
// } else {
//     testData += 1;
//     console.log("this isn't",testData, workerData);
//     parentPort.postMessage(workerData);
//     // console.log("this isn't2",testData[workerData]);
// }
(async function () {
    try {
        let screenShot = new ScreenShot();
    } catch (e) {
        console.log(e);
    }

})();

// export default Parser;
module.exports = {
    ScreenShot
};
