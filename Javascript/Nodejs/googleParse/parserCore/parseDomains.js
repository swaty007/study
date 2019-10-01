// gconf-service libasound2 libatk1.0-0 libatk-bridge2.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget
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
puppeteer.use(pluginStealth());
puppeteer.use(recaptchaPlugin);


class Domains {
    parse(domain) {
        return new Promise(async (resolve, reject) => {
            await this.parseUkraine(domain).then(info => resolve(info));
        });
    }
    async parseUkraine(domain) {
        return new Promise(async (resolve, reject) => {
            this.browser = puppeteer.launch({args: ["--no-sandbox", '--disable-setuid-sandbox'], headless: true}).then(async browser => {
                const page = this.page = await browser.newPage();
                await page.setViewport({width: 1280, height: 800});
                // await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36');

                await page.goto('https://www.ukraine.com.ua/domains/');
                await page.solveRecaptchas();
                await page.$('input#domain_check_input_single');
                await page.type('input#domain_check_input_single', domain, {delay: 20});
                try {
                    await Promise.all([
                        page.waitForResponse('https://www.ukraine.com.ua/action/hosting/dns/check_results/',{timeout: 5000}),
                        page.evaluate(() => domain_check())
                    ]);
                } catch (err) {
                    await browser.close();
                    resolve(false);
                    return;
                }

                await page.waitFor(2000);

                await page.waitForSelector('#domain_check_order_list>tbody>tr>td img', { visible: true });
                let element = await page.$("#domain_check_order_list");
                let html = await page.evaluate(el => {console.log(el.outerHTML); return el.outerHTML;  }, element);
                await browser.close();
                await this.parseHtmlUkraine(html).then(info => {
                    resolve(info);
                });

            });
        });
    }
    async parseHtmlUkraine(html) {
        return new Promise((resolve, reject) => {
            let $ = cheerio.load(html),
                status = true,
                n_price = $("th:contains('Цена')").index() + 1,
                price = $(`tbody tr:first-child td:nth-child(${n_price})`).text().trim().replace(/\s/g, '');
            if ($('tbody tr:first-child td:first-child img').attr('src') == "/design/ukraine/img/domain_error.png") {
                status = false;
            }
            // let n_price = $("th").filter((i, el) => {
            //     console.log($(el).text());
            //     return $(el).text().toLowerCase().indexOf("цена") >= 0;
            // });//.first();
            // n_price.index();
            resolve({
                status: status,
                price: price,
            });
        });
    }
}


// (async function () {
//     try {
//         let domains = new Domains();
//         await domains.parse("infinitum.tech.ya").then(n => {console.log(n)});
//         await domains.parse("infinitum.tech").then(n => {console.log(n)});
//         // await domains.parse("www.fragrantica.ru").then(n => {console.log(n)});
//         // await domains.parse("vash-aromat.ru").then(n => {console.log(n)});
//         // await domains.parse("car.ua").then(n => {console.log(n)});
//         // await ads.parseKeyword("Новости Украина");
//     } catch (e) {
//         console.log(e);
//     }
//
// })();

// export default Parser;
module.exports = {
    Domains
};
