
class App {
    constructor() {
        this.events();
    }


    events() {

        Vue.config.devtools = true;


        Vue.component('vue-form-google', require('./components/Vue_form_google.vue').default);
        Vue.component('vue-domains', require('./components/Vue_domains.vue').default);
        Vue.component('vue-google-table', require('./components/Vue_google_table.vue').default);
        Vue.component('vue-queries', require('./components/Vue_queries.vue').default);




        const root = require('./components/App.vue').default;
        const app = new Vue({
            el: '#app',
            render: createElement => createElement(root),
            components: {
                root,
            },
        });










        $(document).ready(function () {

            function sortDomains(data, domains) {
                // console.log(data,'copy');
                // let sortDomainsArray = Object.entries(data).sort((a, b) => {
                //     return b[1].length - a[1].length;
                // });
                // console.log(sortDomainsArray,'sortDomainsArray');
                // let sortDomains = Object.fromEntries(sortDomainsArray);
                // console.log(sortDomains,'sortDomains ');
                // console.log(data,'data ');
                let n = 0;
                for (domain in data) {//sortDomains
                    // console.log(variable,sortDomains[variable].length,"sortDomains.var.length");
                    $("#accordionDomain").append(`
<div class="card" id="heading${n}" data-top="${data[domain].length}">
    <div class="card-header">
        <button class="btn btn-link dropdown-toggle" type="button" data-toggle="collapse" data-target="#collapse${n}" aria-expanded="true" aria-controls="collapse${n}">
          ${domain} 
        </button>
        <span>Запросов: <strong>${data[domain].length}</strong></span>
          <span>Топ3: <strong id="top3_${n}">0</strong> </span>
          <span>Топ5: <strong id="top5_${n}">0</strong> </span>
          <span>Топ10: <strong id="top10_${n}">0</strong></span>
          <span>Доступен: <strong>${domains[domain] ? domains[domain].status?"Можно купить":"Куплен" : "Ошибка"}</strong></span>
          <span>Цена: <strong>${domains[domain] ? domains[domain].price : ""}</strong></span>
    </div>
    <div id="collapse${n}" class="collapse" aria-labelledby="heading${n}" data-parent="#accordionDomain" style="">
        <div class="card-body" >
            <table class="table table-striped table-bordered">
                                    <thead>
                                    <tr>
                                        <th>Position</th>
                                        <th>query</th>
                                        <th>titleGoogle</th>
                                        <th>href</th>

                                    </tr>
                                    </thead>
                                    <tbody id="domain${n}">
                                    </tbody>
            </table>
        </div>
    </div>
</div>
`);
                    let top3 = 0,
                        top5 = 0,
                        top10 = 0;
                    // console.log(sortDomains[domain]);
                    data[domain].forEach(function (item) {
                        switch (true) {
                            case (item.position < 10 && item.position >= 5):
                                top10 += 1;
                                break;
                            case (item.position < 5 && item.position >= 3):
                                top10 += 1;
                                top5 += 1;
                                break;
                            case (item.position < 3 && item.position >= 0):
                                top10 += 1;
                                top5 += 1;
                                top3 += 1;
                                break;
                        }
                        ;
                        $("#domain" + n).append(`<tr>
<td>${item.position}</td>
<td>${item.query}</td>
<td>${item.title}</td>
<td>${item.href}</td>
</tr>`);
                    });
                    $("#heading" + n).attr('data-top3', top3);
                    $("#heading" + n).attr('data-top5', top5);
                    $("#heading" + n).attr('data-top10', top10);
                    $("#top3_" + n).text(top3);
                    $("#top5_" + n).text(top5);
                    $("#top10_" + n).text(top10);
                    n++;
                }
                ;
                filterDomain();
            }

            function filterDomain() {
                let data_sort = 'top';
                let sortDirection = -1;

                switch ($("input[name='topSortRadio']:checked").val()) {
                    case "DESC":
                        sortDirection = -1;
                        break;
                    case "ASC":
                        sortDirection = 1;
                        break;
                }
                switch (Number($("input[name='topDomainRadio']:checked").val())) {
                    case 10:
                        data_sort = 'top10';
                        break;
                    case 5:
                        data_sort = 'top5';
                        break;
                    case 3:
                        data_sort = 'top3';
                        break;
                    default:
                        data_sort = 'top';
                        break;
                }
                $("#accordionDomain .card").sort(function (a, b) {
                    return (a.dataset[data_sort] - b.dataset[data_sort]) * sortDirection;
                }).appendTo("#accordionDomain");
            }

            $(document).on('change', "input[name='topDomainRadio'], input[name='topSortRadio']", filterDomain);

        });









    }
    // Functions

}

export default App;
