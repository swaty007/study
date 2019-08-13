function initParserHtmlVue() {
    this.domain = 'https://ru.vuejs.org';
    this.URL = 'https://ru.vuejs.org/v2/guide/installation.html';
    this.active_link = '.sidebar-link.current';
    this.next_link = '.sidebar-link';
    this.content = '.content.guide.with-sidebar';
    console.log(resolve,'resolve');
    // `tress` последовательно вызывает наш обработчик для каждой ссылки в очереди
    this.promise = new Promise((resolve, reject) => {
        // Эта функция будет вызвана автоматически

        // В ней можно делать любые асинхронные операции,
        // А когда они завершатся — нужно вызвать одно из:
        // resolve(результат) при успешном выполнении
        // reject(ошибка) при ошибке

        this.q = tress((url, callback) => {

            //тут мы обрабатываем страницу с адресом url
            needle.get(url, (err, res) => {
                if (err) throw err;

                // здесь делаем парсинг страницы из res.body
                // делаем results.push для данных о новости
                // делаем q.push для ссылок на обработку

                // парсим DOM
                var $ = cheerio.load(res.body);
                //информация о новости

                $('#ad').remove();
                this.results.push({
                    title: $('h1').text(),
                    href: url,
                    content: $(this.content).html(),
                    size: $(this.content).html().length
                });

                var next_el = $(this.active_link).parent('li').next('li');

                if (next_el.find(this.next_link).length) {
                    var href = next_el.find(this.next_link).attr('href');
                } else {
                    var href = next_el.next().find(this.next_link).attr('href');
                }

                console.log(this.domain,href);
                if (href) {
                    this.q.push (this.domain+href);
                }
                callback(); //вызываем callback в конце
            });

        }, this.threads);
        // эта функция выполнится, когда в очереди закончатся ссылки
        this.q.drain = () => {
            // fs.writeFileSync('./data.json', JSON.stringify(this.results, null, 4));
            resolve(this.results);
            this.results.forEach(function (i) {
                console.log('write', i.title);
                let html = `<!DOCTYPE html>
<html lang="en" id="wrapper">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${i.title}</title>

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
    <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->

    <link href="./style.css" rel="stylesheet" type="text/css">

    <!-- версия для разработки, отображает полезные предупреждения в консоли -->
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>

    <!-- production-версия, оптимизированная для размера и скорости -->
    <!--    <script src="https://cdn.jsdelivr.net/npm/vue"></script>-->

</head>
<body id="main">
<p>Спаршено с: <a href="${i.href}">${i.href}</a></p>
${i.content}
</body>
</html>`;
                fs.writeFileSync('./Javascript/Vue/parsed/'+i.title.replace('/','')+'.html', html);
            });
        }
    });
}
function getHtmlVue () {
    this.initParserHtmlVue();
    this.q.push(this.URL);
    return this.promise;
}
function initTruecaller () {
    const browser = puppeteer.launch({args: ["--no-sandbox"], headless: false}).then( async browser => {
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36');
        await page.goto('https://www.truecaller.com/auth/sign-in');
        // await page.goto('https://usr.minjust.gov.ua/ua/freesearch');
        // await page.goto('https://recaptcha-demo.appspot.com/recaptcha-v3-request-scores.php');
        // await page.goto('https://bot.sannysoft.com/');
        await page.solveRecaptchas();
        // await page.addScriptTag({url: 'https://code.jquery.com/jquery-3.2.1.min.js'});

        await page.$('input#query');
        await page.type('input#query', '3081600974', {delay: 20});


        const listHandle =
            await page.$('main>div>a:nth-child(3)');
        const hndle = listHandle.asElement();
        await page.$('main>div>a:nth-child(3)');
        await page.click('main>div>a:nth-child(3)');
        await page.waitFor(1000);
        await page.$('input[type=email]');
        await page.type('input[type=email]', 'zubgniloy@gmail.com', {delay: 20});
        await page.click('#identifierNext');
        await page.waitFor(1000);
        await page.$('input[type=password]');
        await page.type('input[type=password]', 'teST67maNey', {delay: 20});
        await page.click('#passwordNext');
        await page.waitFor(3000);
        page.waitForNavigation();
        await page.waitFor(3000);
        await page.$('form input[type=tel]');
        await page.type('form input[type=tel]', '638316055', {delay: 20});
        await page.click('button[type=submit]');
        await page.waitFor(1000);
        page.waitForNavigation();
        // For DOM element properties
        const element = await page.$("h1");
        const text = await page.evaluate(element => { return element.textContent}, element);
        console.log(text);
        // For HTML attributes:
        // const element = await page.$("#april");
        // await page.evaluate(element => { element.setAttribute('value', 7); }, element);

        await page.screenshot({ path: "./Javascript/Nodejs/googleParse/photos/screen.png", fullPage: true });
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
