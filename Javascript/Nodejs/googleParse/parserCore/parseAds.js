const cheerio = require('cheerio'),
    fs = require('fs');

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
// puppeteer.use(pluginStealth());
puppeteer.use(recaptchaPlugin);


class Ads {
    loginAds(cookieName) {
        return new Promise(async (resolve, reject) => {
            this.browser.then(async () => {
                console.time('login Ads');
                const page = this.page;
                await page.setViewport({ width: 1280, height: 800 });
                await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36');
                await page.goto('https://ads.google.com/intl/ru_UA/home/');
                await page.solveRecaptchas();
                // await page.addScriptTag({url: 'https://code.jquery.com/jquery-3.2.1.min.js'});

                await page.waitForSelector('ul.h-c-header__cta-list>li:nth-child(2) a', { visible: true });
                await page.click('ul.h-c-header__cta-list>li:nth-child(2) a');
                await page.waitForNavigation();

                await page.$('input[type=email]');
                await page.type('input[type=email]', 'zubgniloy@gmail.com', {delay: 20});
                // await page.type('input[type=email]', 'swaty0007@gmail.com', {delay: 20});
                await page.click('#identifierNext');
                await page.waitForSelector('input[type=password]', { visible: true });
                // await page.type('input[type=password]', 'Newlife007', {delay: 20});
                await page.type('input[type=password]', 'teST67maNey1', {delay: 20});
                await page.click('#passwordNext');
                // await page.waitFor(3000);
                await page.waitForNavigation({waitUntil: 'networkidle0'});
                const cookiesObject = await page.cookies();
                // console.log("COOKIE =  ",cookiesObject);
                fs.writeFileSync('./Javascript/Nodejs/googleParse/parserCore/puppeteer/'+cookieName, JSON.stringify(cookiesObject));
                console.timeEnd('login Ads');
                resolve();
            });
        });
    }
    async loadCookie(cookieName) {
        return new Promise(async (resolve, reject) => {
            this.browser = puppeteer.launch({args: ["--no-sandbox"], headless: false}).then(async browser => {
                console.time('init Ads');
                const page = this.page = await browser.newPage();
                await page.setViewport({width: 1280, height: 800});
                await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36');

                const previousSession = fs.existsSync('./Javascript/Nodejs/googleParse/parserCore/puppeteer/'+cookieName);
                if (previousSession) {
                    const content = fs.readFileSync('./Javascript/Nodejs/googleParse/parserCore/puppeteer/'+cookieName);
                    const cookiesArr = JSON.parse(content);
                    if (cookiesArr.length !== 0) {
                        for (let cookie of cookiesArr) {
                            await page.setCookie(cookie);
                            resolve();
                        }
                        console.log('Session has been loaded in the browser');
                    }
                } else {
                    console.log('Session not been loaded in the browser, try to login');
                    this.loginAds(cookieName).then(()=> {
                        resolve();
                    });
                }
            });
        });
    }
    async parseKeyword(keyword) {
        console.log('start out', keyword);
        await this.browser.then(async () => {
            console.time('time' + keyword);
            console.log('start inside', keyword);
            const page = this.page;
            await page.goto('https://ads.google.com/aw/keywordplanner/home');
            // await page.waitForNavigation();
            await page.waitForSelector('splash-cards', { visible: true });

            let element = await page.$('splash-cards>div>div:nth-child(1)');
            let position = await page.evaluate(el => {
                return {x: el.getBoundingClientRect().x, y: el.getBoundingClientRect().y}
            }, element);

            const mouse = page.mouse;
            await mouse.move(parseFloat(position.x), parseFloat(position.y));
            await mouse.click(parseFloat(position.x), parseFloat(position.y), {
                "button": "left",
                "clickCount": 1,
                "delay": 0
            });

            await page.waitForSelector('splash-cards input.search-input', { visible: true });
            await page.type('splash-cards input.search-input', keyword, {delay: 20});
            await page.waitFor(200);

            element = await page.$('splash-cards .get-results-button-container material-button');
            position = await page.evaluate(el => {
                return {x: el.getBoundingClientRect().x, y: el.getBoundingClientRect().y}
            }, element);

            await mouse.move(parseFloat(position.x), parseFloat(position.y));
            await mouse.click(parseFloat(position.x), parseFloat(position.y), {
                "button": "left",
                "clickCount": 1,
                "delay": 0
            });

            // await Promise.all([
            // page.waitForNavigation(), // The promise resolves after navigation has finished
            // Clicking the link will indirectly cause a navigation
            // ]);

            await page.waitForNavigation();
            console.log('finish Navigation');
            await page.waitFor(1000);

            // For HTML attributes:
            element = await page.$("ess-particle-table");
            let html = await page.evaluate(el => {console.log(el.innerHTML); return el.innerHTML;  }, element);
            await this.parseHtml(html);

            // await page.screenshot({path: "./Javascript/Nodejs/googleParse/photos/" + keyword + ".png", fullPage: true});
            console.timeEnd('time' + keyword);
            console.log('end inside', keyword);
        });
    }
    async parseHtml(html) {
        return new Promise((resolve, reject) => {
            let $ = cheerio.load(html);
            $("keyword-text").each((index, element) => {
                let el = $(element),
                    text = el.text().trim(),
                    bid_min = el.parent("ess-cell").siblings("[essfield=bid_min]").text().trim(),
                    bid_max = el.parent("ess-cell").siblings("[essfield=bid_max]").text().trim(),
                    search_volume = el.parent("ess-cell").siblings("[essfield=search_volume]").text().trim();
                console.log(text,"max=",bid_max,"min=",bid_min,search_volume);

            });
            resolve();
        });
    }
}


(async function () {
    try {
        let ads = new Ads();
        await ads.loadCookie('zubgniloy');
        await ads.parseKeyword("Новости, Новости Украина");
        // await ads.parseKeyword("Новости Украина");
    } catch (e) {
        console.log(e);
    }

})();

// export default Parser;
module.exports = {
    Ads
};
