function getAadToken(user, password, identifier) {
    return puppeteer.launch({ headless: true }).then(async browser => {
        try {
            const page = await browser.newPage();

            await page.goto("SITEURL");

            await page.click(
                "LOGINBUTTON"
            );
            await page.waitFor(2000);
            await page.click("input[name=passwd]");
            await page.type("input[name=loginfmt]", user, {
                delay: 50
            });
            await page.waitFor(500);
            await page.click("input[type=submit]");
            await page.waitFor(500);
            await page.click("input[name=passwd]");
            await page.waitFor(500);
            await page.type("input[name=passwd]", password, {
                delay: 50
            });
            await page.waitFor(500);
            await page.click("input[type=submit]");
            await page.waitForSelector("SELECTOR-ON-WEBSITE-TO-MAKE-SURE-YOU-ARE-BACK-ON-WEBSITE", { visible: true });

            let aadValues = await page.evaluate(() => {
                let values = {};
                for (var i = 0, len = localStorage.length; i < len; ++i) {
                    if (
                        localStorage.key(i).startsWith("msal.") ||
                        localStorage.key(i).startsWith('{"authority":')
                    ) {
                        values[localStorage.key(i)] = localStorage.getItem(
                            localStorage.key(i)
                        );
                    }
                }

                return values;
            });
            browser.close();

            fs.readFile("aad-tokens.ts", "utf8", (err, data) => {
                let regex = new RegExp(
                    `export const\\s*${identifier}\\s*=\\s*{(.|\\n)*?};`
                );
                let result = data.replace(
                    regex,
                    `export const ${identifier} = ${JSON.stringify(aadValues)};`
                );
                fs.writeFile("aad-tokens.ts", result, "utf8");
            });
            console.log(`${identifier} completed`);
        } catch (error) {
            console.log(error);
            browser.close();
        }
    });
};
