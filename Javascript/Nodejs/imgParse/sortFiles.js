const tress = require('tress'),
    fs = require('fs'),
    // axios = require('axios'),
    request = require('request'),
    {performance} = require('perf_hooks'),
    path = require('path');
const child_process = require('child_process');

class SortFiles {
    constructor() {

        this.filesPath = "D:/parsedBigData/image";
        this.findedPath = "./Javascript/Nodejs/imgParse/parsedimg/scriptFinded";
        this.threads = 50;
        this.threadUsed = {
            cdm: 0,
            img: 0,
            file: 0,
        };
    }

    async init() {
        this.checkDir(this.filesPath);
        // return;
        // new Promise((resolve, reject) => {
        // 	console.time("Brute Work");
        // 	this.parse = tress((data, callback) => {
        // 		this.parsePrnt(data, callback);
        // 	}, this.threads);
        // 	this.parse.drain = () => {
        // 		console.timeEnd("Brute Work");
        // 		resolve();
        // 	};
        // 	for (let i = 0; i < this.threads; i++) {
        // 		this.parse.push({});
        // 	}
        //
        // });
    }

    checkDir(dirPath) {
        //fs.opendir(path, (errDirOpen, dir) => {

        //	console.log(dir,'dir');
        //});
        console.log(dirPath);
        //console.log(path.parse(dirPath));

        fs.readdir(dirPath, {withFileTypes: true}, async (errDir, files) => {

            //files.forEach( async (el,i) => {

            for (let index = 0; index < files.length; index++) {
                let el = files[index];
                //console.log(el);

                await new Promise(async (resolve, reject) => {

                    if (el.isDirectory()) {
                        //console.log(el,'dir');
                        //console.log(el.path,'el.path');
                        //console.log(dirPath+el.name);
                        //console.log( path.join(dirPath,el.name));
                        this.checkDir(path.join(dirPath, el.name));
                        resolve();
                    }
                    if (el.isFile()) {
                        // if ( el.name.slice(-4) === '.txt') {
                        //console.log(path.join(dirPath,el.name), files.length);
                        //console.log(el,'file');
                        this.threadUsed.file++;
                        await this.checkFile(dirPath, el.name).then(() => {
                            this.threadUsed.file--;
                            resolve();
                        });
                        if (this.threads <= this.threadUsed.file) {
                            resolve();
                        }

                        //await this.checkFile(path.join(dirPath,el.name));
                        //await console.log(fs.readFileSync(path.resolve(dirPath,el.name)));
                        //fs.open(path.resolve(dirPath,el.name), (errOpen, fd) => {
                        //	console.log(fd, "fd");
                        //});
                        // return;
                        // }
                        // resolve();
                    }
                    //console.log(el.name,'name');

                });
            }
            //});

//dir[Symbol.asyncIterator]();
        });
    }

    async checkFile(dirPath, fileName) {
        let filePath = path.join(dirPath, fileName);
        return new Promise((resolve, reject) => {

            //console.log(text, fileName);
            //let parentDir = path.parse(path.parse(path.join(dirPath, fileName)).dir).base;
            if (fileName.slice(-4) === '.txt') {
                // let text = fs.readFileSync(filePath).toString('utf8').replace(/,|\n| |\s|;/g, '');
                this.threadUsed.file++;
                fs.readFile(filePath, (errFile, data) => {
                    if (errFile) {
                        console.log('errFile', errFile);
                    }
                    let text = data.toString('utf8').replace(/,|\n| |\s|;/g, '');
                    this.threadUsed.file--;
                    if (text.search(/(pas[s]?word|пароль|login|логин)/) !== -1) {
                        this.threadUsed.img++;
                        Promise.all([
                            this.findImg(path.join(dirPath, fileName.replace('.txt', '.jpg'))),
                            this.findImg(path.join(dirPath, fileName.replace('.txt', '.png'))),
                            this.findImg(path.join(dirPath, fileName.replace('.txt', '.jpeg'))),
                        ]).then((imgArr) => {
                            //console.log(imgArr, imgArr.includes(true),fileName);
                            if (imgArr.includes(true)) {
                                //fs.renameSync(path.join(dirPath, fileName), path.join('D:/parsedBigData/image/',parentDir, fileName));
                                //console.log('from=',path.join(dirPath, fileName),'		to=',path.join('D:/parsedBigData/image/',parentDir, fileName));
                            } else {
                                //fs.unlinkSync(path.join(dirPath, fileName));
                                //console.log('unlinkFile',path.join(dirPath, fileName));
                                //fs.renameSync(path.join(dirPath, fileName), path.join('D:/OpenServer/OSPanel/domains/study/Javascript/Nodejs/imgParse/parsedimg/prnt/', fileName));
                                //console.log('from=',path.join(dirPath, fileName),'		to=',path.join('D:/OpenServer/OSPanel/domains/study/Javascript/Nodejs/imgParse/parsedimg/prnt/', fileName));
                            }
                            this.threadUsed.img--;
                            resolve();
                        });
                        if (this.threads <= this.threadUsed.img) {
                            resolve();
                        }

                    } else {
                        resolve();
                    }
                    ;
                });
                if (this.threads <= this.threadUsed.file) {
                    resolve();
                }


            } else {

                new Promise((resolve, reject) => {
                    let filename = fileName.replace(/[.]jpg|[.]jpeg|[.]png|[.]svg/, '.txt');
                    // console.log(filename);
                    // fs.stat(path.join(dirPath, fileName), (errorImg,statsImg) => {
                    // 	console.log('errorImg=',errorImg,'statsImg=', statsImg);
                    // });
                    fs.stat(path.join(dirPath, filename), (error_stats, stats) => {
                        // console.log(error_stats,stats);
                        if (error_stats != null) {
                            if (error_stats.code == "ENAMETOOLONG") {
                                console.log("EXIT FROM ERROR");
                                resolve(false);
                                return;
                            }
                            this.threadUsed.cdm++;
                            let parentDir = path.parse(path.parse(path.join(dirPath, filename)).dir).base;
                            let cmd = `D:\\neyro\\Tesseract-OCR\\tesseract "D:\\parsedBigData\\image\\${parentDir}\\${fileName}" "D:\\parsedBigData\\image\\${parentDir}\\${filename.replace('.txt', '')}" -l eng+rus+script/Cyrillic`;
                            console.log(cmd, 'cmd');
                            let workerProcess = child_process.exec(cmd, (error, stdout, stderr) => {
                                if (error) {
                                    console.log(error.stack, 'stats=', stats, 'error_stats=', error_stats);
                                    console.log('Error code: ' + error.code);
                                    console.log('Signal received: ' + error.signal);
                                    fs.unlink(path.join(dirPath, fileName), (err) => {
                                        resolve();
                                    });
                                    fs.unlink(path.join(dirPath, filename), (err) => {
                                        resolve();
                                    });
                                }
                                //console.log('stdout: ' + stdout);
                                console.log('stderr: ' + stderr, 'stderrEnd');
                            });
                            workerProcess.on('exit', (code) => {
                                console.log('Child process exited with exit code ' + code);
                                this.checkFile(dirPath, filename);
                                this.threadUsed.cdm--;
                                resolve();
                            });
                            if (5 <= this.threadUsed.cdm) {//this.threads
                                resolve();
                            }
                            return;
                        }
                        resolve();
                    });
                }).then((res) => {
                    resolve();
                });


            }


        });
    }

    async findImg(imgPath) {
        //console.log(path.parse(path.parse(imgPath).dir));
        //console.log('img',imgPath);

        return new Promise((resolve, reject) => {
            fs.stat(imgPath, (error_stats, stats) => {
                //console.log('error_stats', error_stats);
                //console.log('stats', stats);
                if (error_stats != null) {
                    if (error_stats.code == "ENAMETOOLONG") {
                        console.log("EXIT FROM ERROR");
                        resolve(false);
                        return;
                    }
                    resolve(false);
                    return;
                }
                let parseImgPath = path.parse(imgPath);
                // let parentDir = path.parse(path.parse(imgPath).dir).base;
                //console.log(parentDir);
                //console.log('join',path.join(this.findedPath, (parseImgPath.name + parseImgPath.ext)) );
                //fs.renameSync(path.join(imgPath), path.join('D:/parsedBigData/image/', parentDir,(parseImgPath.name + parseImgPath.ext)));
                //console.log('from=',path.join(imgPath),'		to=',path.join('D:/parsedBigData/image/', parentDir,(parseImgPath.name + parseImgPath.ext))  );

                let readStream = fs.createReadStream(imgPath),
                    writeStream = fs.createWriteStream(path.join(this.findedPath, (parseImgPath.name + parseImgPath.ext)));
                readStream.on('error', (e) => {
                    console.log('errorReadStream', e);
                    resolve(true);
                });
                writeStream.on('error', (e) => {
                    console.log('errorWriteStream', e);
                    resolve(true);
                });
                writeStream.on('close', () => {
                    // console.log('writeStreamClose');
                    resolve(true);
                });
                readStream.pipe(writeStream);

            });
        });
    }


}


// (async function () {
//     try {
//         let sortFiles = new SortFiles().init();
//
//     } catch (e) {
//         console.log(e);
//     }
//
// })();

// export default Parser;
module.exports = {
    SortFiles
};
