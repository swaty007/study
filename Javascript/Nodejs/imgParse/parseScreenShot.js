// gconf-service libasound2 libatk1.0-0 libatk-bridge2.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget
const cheerio = require('cheerio'),
    tress = require('tress'),
    needle = require('needle'),
    fs = require('fs'),
    // axios = require('axios'),
    request = require('request'),
    {performance} = require('perf_hooks'),
    path = require('path'),
    {SortFiles} = require("./sortFiles");

const child_process = require('child_process');
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
            telegram: "telegram",
        };
        this.stop = {
            prnt: false,
            joxi: false,
            screencapture: false,
            imgur: false,
            telegram: false,
        };
        this.totalRequest = {
            site: 0,
            img: 0,
            time: 0,
            old: 0,
        };
        this.filesPath = "D:/parsedBigData/image";
        this.threads = 3;
        this.threadsInit = 0;
        this.sortFiles = new SortFiles();
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
                if (isMainThread && this.threadsInit === 0) {
                    this.parsePrnt(data, callback);
                }
                this.parseJoxi(data, callback);
                this.parseScreencapture(data, callback);
                this.parseImgur(data, callback);
                this.threadsInit += 1;
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
            try {
                await Promise.all([
                    this.getImg(this.generateLink(5), this.types.prnt),
                    this.getImg(this.generateLink(6), this.types.prnt),
                ]);
            } catch (e) {
                await Promise.all([
                    this.getImg(this.generateLink(5), this.types.prnt),
                    this.getImg(this.generateLink(6), this.types.prnt),
                ]);
            }

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

    async parseTelegram() {
        do {
            await this.getImg("6856db55-cf1a-477c-9db1-cf77f51b0a4d", this.types.telegram);
            // await this.getImg(this.generateLink(7), this.types.telegram);
        } while (this.stop.telegram === false);
        console.log('Telegram Stop');
    }

    async getImg(url, type) {
        return new Promise(async (resolve, reject) => {
            switch (type) {
                case this.types.prnt:
                    url = "https://prnt.sc/" + url;
                    break;
                case this.types.joxi:
                    url = "http://joxi.net/" + url;
                    break;
                case this.types.screencapture:
                    url = "https://www.screencapture.ru/file/" + url;
                    break;
                case this.types.imgur:
                    url = "https://imgur.com/" + url;
                    break;
                case this.types.telegram:
                    url = "blob:https://web.telegram.org/" + url;
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
                if (!isMainThread) {
                    if (this.totalRequest.site >= 500) {
                        parentPort.postMessage(this.totalRequest.site);
                        // console.log('worker #',workerData,' requests=', this.totalRequest.site);
                        this.totalRequest.site = 0;
                    }
                }
                if (this.totalRequest.site - this.totalRequest.old >= 10000) {
                    this.totalRequest.old = this.totalRequest.site;
                    console.log(this.totalRequest.site);
                    console.log(this.totalRequest.time = performance.now() - this.totalRequest.time);
                    // 19397.40339899063 3thread(100)
                    // 9886.00529909134 6thread(100)
                    // 7442.8571009635925 10thread(100)
                    // 5540.61200094223 5thread + 2 worker(100)
                    // 4199.164801120758 5thread + 3 worker(100)
                    // 38673.47180008888 5thread + 4 worker (10000)
                }
                // console.log('img =',this.totalRequest.img, ' site =',this.totalRequest.site);
                if (res.statusCode === 403) {
                    this.stop[type] = true;
                    resolve();
                    return;
                }
                // console.log(res.statusCode, this.totalRequest.site, url);
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
                let filename = img.split('/').pop().split('?')[0];


                fs.stat(path.join(this.filesPath, type, filename), (error_stats, stats) => {
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
                                }).pipe(fs.createWriteStream(path.join(this.filesPath, type, filename))
                                    .on('finish', () => {
                                        this.totalRequest.img += 1;
                                        console.log('img =', this.totalRequest.img, ' site =', this.totalRequest.site, 'type =', type);


                                        let cmd = `D:\\neyro\\Tesseract-OCR\\tesseract "D:\\parsedBigData\\image\\${type}\\${filename}" "D:\\parsedBigData\\image\\${type}\\${filename.replace(/[.]png|[.]svg|[.]jpg|[.]jpeg/, '')}" -l eng+rus+script/Cyrillic`;
                                        //console.log('cmd',cmd);
                                        let workerProcess = child_process.exec(cmd, (error, stdout, stderr) => {
                                            if (error) {
                                                console.log(error.stack);
                                                console.log('Error code: ' + error.code);
                                                console.log('Signal received: ' + error.signal);
                                                resolve();
                                                //throw new Error(error);
                                            }
                                            //console.log('stdout: ' + stdout);
                                            // console.log('stderr: ' + stderr, 'stderrEnd');
                                        });
                                        workerProcess.on('exit', (code) => {
                                            // console.log('Child process exited with exit code '+code);
                                            this.sortFiles.checkFile(path.join(this.filesPath, type), filename.replace(/[.]png|[.]svg|[.]jpg|[.]jpeg/, '.txt'));
                                            // .then(()=>{console.log('file checked')});
                                            resolve();
                                        });


                                        // if (this.totalRequest.img == 100) {
                                        // console.log(this.totalRequest.time = performance.now() - this.totalRequest.time);
                                        // 112530.05260109901
                                        // 46761.85130095482 5 threads and + ban
                                        // }
                                        //resolve();
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


if (isMainThread) {
    let screenShot = new ScreenShot();


    for (let i = 1; i < 8; i++) {
        let w = new Worker(__filename, {workerData: i});
        w.on('message', (msg) => { //Сообщение от воркера!
            // console.log("Сообщение от воркера: ", msg);
            screenShot.totalRequest.site += msg;
        });
        w.on('error', (error) => {
            console.log("worker error", error);
        });
        w.on('exit', (code) => {
            if (code != 0)
                console.error(new Error(`Worker stopped with exit code ${code}`))
        });
    }

    try {
        // let screenShot = new ScreenShot();
    } catch (e) {
        console.log(e, 'errorMainScript');
    }

} else {
    let screenShot = new ScreenShot();
    // console.log("this isn't",testData, workerData);
    // parentPort.postMessage(workerData);
    // console.log("this isn't2",testData[workerData]);
}
(async function () {
    try {
        // let screenShot = new ScreenShot();

        // screenShot.totalRequest.site = 0;

        // console.log(this.totalRequest.time = performance.now() - this.totalRequest.time);

    } catch (e) {
        console.log(e);
    }

})();

// export default Parser;
module.exports = {
    ScreenShot
};
