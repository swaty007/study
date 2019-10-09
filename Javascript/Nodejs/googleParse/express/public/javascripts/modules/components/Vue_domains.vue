<template>
    <section class="domains">
        <div class="row">
            <div class="col-sm-6">
                <div class="form-group">
                    <label>По каким позициям сорт</label>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="topDomainRadio" value="0"
                               checked v-model="topDomainRadio">
                        <label class="form-check-label">
                            All
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="topDomainRadio"
                               value="3" v-model="topDomainRadio">
                        <label class="form-check-label">
                            Top 3
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="topDomainRadio"
                               value="5" v-model="topDomainRadio">
                        <label class="form-check-label">
                            Top 5
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="topDomainRadio"
                               value="10" v-model="topDomainRadio">
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
<!--        <div id="accordionDomain" class="accordion" :is="sites">-->

            <div class="card" :data-top="sites[domain].length" :id="'heading'+index" v-for="(val, domain, index) in sites">
                <div class="card-header" @click="selected === domain ? selected = null : selected = domain">
                    <button class="btn btn-link dropdown-toggle">
                        {{domain}}
                    </button>
                    <span>Запросов: <strong>{{sites[domain].length}}</strong></span>
                    <span>Топ3: <strong :id="'top3_'+index">0</strong> </span>
                    <span>Топ5: <strong :id="'top5_'+index">0</strong> </span>
                    <span>Топ10: <strong :id="'top10_'+index">0</strong></span>
                    <span>Доступен: <strong>{{domains[domain] ? domains[domain].status?"Можно купить":"Куплен" : "Ошибка"}}</strong></span>
                    <span>Цена: <strong>{{domains[domain] ? domains[domain].price : ""}}</strong></span>
                </div>
                <div :class="{collapse:domain !== selected}" >
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
                            <tr v-for="item in sites[domain]">
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

<!--        </div>-->
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
            }
        },
        computed: {

        },
        mounted() {

        }
    }
</script>
