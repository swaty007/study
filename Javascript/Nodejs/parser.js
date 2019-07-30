const tress = require('tress'),
    needle = require('needle'),
    cheerio = require('cheerio'),
    resolve = require('url').resolve,
    fs = require('fs');

class Parser {
    constructor() {
        this.URL = 'https://ru.vuejs.org/v2/guide/installation.html';
        this.domain = 'https://ru.vuejs.org';
        this.results = [];
        this.active_link = '.sidebar-link.current';
        this.next_link = '.sidebar-link';
        this.content = '.content.guide.with-sidebar';
        this.threads = 10;
        this.init();
    }

    init() {
        console.log(resolve,'resolve')
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
            }
        });
    }
    getHtml () {
        this.q.push(this.URL);
        return this.promise;
    }
};

// export default Parser;
module.exports = {
    Parser
};
// module.export = Parser;
