const puppeteer = require('puppeteer-extra');
// add stealth plugin and use defaults (all evasion techniques)
const pluginStealth = require("puppeteer-extra-plugin-stealth");
// add recaptcha plugin and provide it your 2captcha token
// 2captcha is the builtin solution provider but others work as well.
const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha'); ///dist/index
const recaptchaPlugin = RecaptchaPlugin({
    provider: { id: '2captcha', token: 'XXXXXXX' },
    visualFeedback: true
});
puppeteer.use(pluginStealth());
puppeteer.use(recaptchaPlugin);

class Ads {
    async initAds () {
         this.browser = puppeteer.launch({args: ["--no-sandbox"], headless: false}).then( async browser => {
            const page = this.page = await browser.newPage();
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36');
            await page.goto('https://ads.google.com/intl/ru_UA/home/');
            await page.solveRecaptchas();
            // await page.addScriptTag({url: 'https://code.jquery.com/jquery-3.2.1.min.js'});

            await page.$('ul.h-c-header__cta-list>li:nth-child(2) a');
            await page.click('ul.h-c-header__cta-list>li:nth-child(2) a');
            await page.waitForNavigation();

            // await page.type('input#query', '3081600974', {delay: 20});
            // const listHandle =
            //     await page.$('main>div>a:nth-child(3)');
            // const hndle = listHandle.asElement();
            // await page.$('main>div>a:nth-child(3)');
            // await page.click('main>div>a:nth-child(3)');
            // await page.waitFor(1000);
            await page.$('input[type=email]');
            await page.type('input[type=email]', 'zubgniloy@gmail.com', {delay: 20});
            await page.click('#identifierNext');
            await page.waitFor(3000);
            // await page.waitForNavigation();
            await page.$('input[type=password]');
            await page.type('input[type=password]', 'teST67maNey', {delay: 20});
            await page.click('#passwordNext');
            // await page.waitFor(3000);
            await page.waitForNavigation();
            await page.waitFor(1000);
        });


        // const dimensions = await page.evaluate(() => {
        //     const $ = window.$;
        //         var login_btn = $('main>div>a:nth-child(3)');
        //         console.log(login_btn);
        //         login_btn.click();
        //         console.log('test');
        //         return {
        //             width: document.documentElement.clientWidth,
        //             height: document.documentElement.clientHeight,
        //             deviceScaleFactor: window.devicePixelRatio
        //         };
        // });
        // console.log('Dimensions:', dimensions);
        // await browser.close();
    }
    async parseKeyword (keyword) {
        console.log('start out',keyword);
        await this.browser.then(async () => {
            console.time('time'+keyword);
            console.log('start inside',keyword);
            const page = this.page;
            await page.goto('https://ads.google.com/aw/keywordplanner/home');
            // await page.waitForNavigation();
            await page.waitFor(3000);
            await page.$('splash-cards');

            let element = await page.$('splash-cards>div>div:nth-child(1)');
            let position = await page.evaluate(element => {return {x:element.getBoundingClientRect().x,y:element.getBoundingClientRect().y}}, element);
            console.log(position);

            const mouse = page.mouse;
            await mouse.move(parseFloat(position.x), parseFloat(position.y));
            await mouse.click(parseFloat(position.x), parseFloat(position.y), {
                "button": "left",
                "clickCount": 1,
                "delay": 0
            });

            await page.$('splash-cards input.search-input');
            await page.type('splash-cards input.search-input', keyword, {delay: 20});
            await page.waitFor(200);

            element = await page.$('splash-cards .get-results-button-container material-button');
            position = await page.evaluate(element => { return {x:element.getBoundingClientRect().x,y:element.getBoundingClientRect().y}}, element);
            console.log(position);

            await mouse.move(parseFloat(position.x), parseFloat(position.y));
            console.log('start click');
            await mouse.click(parseFloat(position.x), parseFloat(position.y), {
                "button": "left",
                "clickCount": 1,
                "delay": 0
            });
            console.log('finish click');

            // await Promise.all([
                // page.waitForNavigation(), // The promise resolves after navigation has finished
                // Clicking the link will indirectly cause a navigation
            // ]);

            await page.waitForNavigation();
            console.log('finish Navigation');
            await page.waitFor(1000);

            // For HTML attributes:
            // const element = await page.$("#april");
            // await page.evaluate(element => { element.setAttribute('value', 7); }, element);

            await page.screenshot({ path: "./Javascript/Nodejs/googleParse/photos/"+keyword+".png", fullPage: true });
            console.timeEnd('time'+keyword);
            console.log('end inside',keyword);
        });
    }
}

(async function (){
    let ads = new Ads();
    await ads.initAds();
    await ads.parseKeyword("Новости");
    await ads.parseKeyword("Новости Украина");
})();

// export default Parser;
module.exports = {
    Ads
};