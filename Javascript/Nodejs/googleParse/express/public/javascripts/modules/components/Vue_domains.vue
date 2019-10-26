<template>
    <section class="domains">
        <div class="row">
            <div class="col-sm-6">
                <div class="form-group">
                    <label>По каким позициям сорт</label>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="topDomainRadio" value="0"
                               checked v-model.number="topDomainRadio">
                        <label class="form-check-label">
                            All
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="topDomainRadio"
                               value="3" v-model.number="topDomainRadio">
                        <label class="form-check-label">
                            Top 3
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="topDomainRadio"
                               value="5" v-model.number="topDomainRadio">
                        <label class="form-check-label">
                            Top 5
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="topDomainRadio"
                               value="10" v-model.number="topDomainRadio">
                        <label class="form-check-label">
                            Top 10
                        </label>
                    </div>
                </div>
            </div>
            <div class="col-sm-6">
                <div class="form-group">
                    <label>Сортировка</label>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="topSortRadio"
                               value="desc" v-model="topSortRadio">
                        <label class="form-check-label">
                            По убыванию
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="topSortRadio"
                               value="asc" v-model="topSortRadio">
                        <label class="form-check-label">
                            По возрастанию
                        </label>
                    </div>
                </div>
            </div>
        </div>
        <div id="accordionDomain" class="accordion">
            <div class="card"
                 :id="'heading'+index"
                 v-for="(site, index) in newSites">
                <div class="card-header" @click="selected === site.domain ? selected = null : selected = site.domain">
                    <button class="btn btn-link dropdown-toggle">
                        {{site.domain}}
                    </button>
                    <span>Запросов: <strong>{{site.top}}</strong></span>
                    <span>Топ3: <strong :id="'top3_'+index">{{site.top3}}</strong> </span>
                    <span>Топ5: <strong :id="'top5_'+index">{{site.top5}}</strong> </span>
                    <span>Топ10: <strong :id="'top10_'+index">{{site.top10}}</strong></span>
                    <span>Доступен: <strong>{{domains[site.domain] ? domains[site.domain].status ? "Можно купить" : "Куплен" : "Ошибка"}}</strong></span>
                    <span>Цена: <strong>{{domains[site.domain] ? domains[site.domain].price : ""}}</strong></span>
                </div>
                <div :class="{collapse:site.domain !== selected}" >
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
                            <tbody>
                            <tr v-for="item in site.data">
                                <td>{{item.position}}</td>
                                <td>{{item.query}}</td>
                                <td>{{item.title}}</td>
                                <td>{{item.href}}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    </section>
</template>

<script>
    export default {
        props: ['sites', 'domains'],
        data() {
            return {
                topSortRadio: "desc",
                topDomainRadio: 0,
                selected: null
            };
        },
        methods: {
            onFilterDomain() {
                // this.$emit("onSubmit", {
                //     sites: this.sites,
                //     size: this.size,
                // });
            },
            filterDomain() {
                return;
                let data_sort = 'top';
                let sortDirection = 1;

                switch (this.topSortRadio) {
                    case "desc":
                        sortDirection = 1;
                        break;
                    case "asc":
                        sortDirection = -1;
                        break;
                }
                switch (this.topDomainRadio) {
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
                this.newSites.sort(function (a, b) {
                    return (a[data_sort] - b[data_sort]) * sortDirection;
                })
            }
        },
        computed: {
            newSites: function () {
                let newArr = [];

                for (let domain in this.sites) {
                    let site = {
                        domain: domain,
                        data: this.sites[domain],
                        top: this.sites[domain].length,
                        top3: 0,
                        top5: 0,
                        top10: 0
                    };
                    this.sites[domain].forEach(( el,index )=> {
                        switch (true) {
                            case (el.position < 10 && el.position >= 5):
                                site.top10 += 1;
                                break;
                            case (el.position < 5 && el.position >= 3):
                                site.top10 += 1;
                                site.top5 += 1;
                                break;
                            case (el.position < 3 && el.position >= 0):
                                site.top10 += 1;
                                site.top5 += 1;
                                site.top3 += 1;
                                break;
                        }
                    });
                    newArr.push(site);
                }

                let data_sort = 'top';
                let sortDirection = -1;

                switch (this.topSortRadio) {
                    case "desc":
                        sortDirection = -1;
                        break;
                    case "asc":
                        sortDirection = 1;
                        break;
                }
                switch (this.topDomainRadio) {
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
                newArr.sort(function (a, b) {
                    return (a[data_sort] - b[data_sort]) * sortDirection;
                });
                return newArr;
            }
        },
        watch: {
            topSortRadio: function(val) {
                this.filterDomain();
                console.log('watchDom topSortRadio',val)
            },
            topDomainRadio: function (val) {
                this.filterDomain();
                console.log('watchDom topDomainRadio',val)
            }
        },
        mounted: function() {
            console.log('mountedDom')
        },
        updated: function() {
            this.filterDomain();
            console.log('updatedDom')
        }
    }
</script>
