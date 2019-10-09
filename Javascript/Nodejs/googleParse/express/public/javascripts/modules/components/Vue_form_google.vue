<template>
    <form id="form_google" @submit.prevent="onSubmit">
        <div class="form-group">
            <label class="main-label">Запросы через запятую (запрос, запрос2) или с новой строки</label>
            <textarea rows="5" type="text" name="sites" class="form-control" v-model="sites" ></textarea>
        </div>
        <div class="form-group">
            <label class="main-label">Количество результатов ТОП</label>
            <select name="size" class="form-control" v-model="size" >
                <option value="1">10</option>
                <option value="2">20</option>
                <option value="3">30</option>
                <option value="4">40</option>
                <option value="5">50</option>
            </select>
        </div>
        <input type="submit" class="btn btn-success"/>
    </form>
</template>

<script>


    export default {
        // props: ['',''],
        data() {
            return {
                sites: null,
                size: 1
            };
        },
        methods: {
            onSubmit() {
                this.$emit("onSubmit", {
                    sites: this.sites,
                    size: this.size,
                });
            }

        },
        mounted() {


        }
    }
</script>
