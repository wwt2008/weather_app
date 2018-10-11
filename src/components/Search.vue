<template>
    <div>

        <div v-if="loaded">

            <div v-if="weathers.length">
                <p>{{ currentDate }}</p>
                <div class="row">
                    <div class="col-sm-6 col-md-4 col-lg-3 mb-4" v-for="(weather, index) in weathers">
                        <weather :key="index" :weather="weather"  ref="weather" @click="weatherClick"></weather>
                    </div>
                </div>

            </div>

            <div v-else>No results were found. Try changing the keyword!</div>

        </div>

        <div v-else>
            <i class="fa fa-spinner fa-spin"></i> Searching locations...
        </div>

    </div>
</template>

<script>
    import {getAllWeathers} from './../js/functions';
    import Card from './Card.vue';

    export default {
        data() {
            return {
                weathers: [],
                date: new Date(),
                loaded: false,
            }
        },
        components: {
            weather: Card,
        },
        computed: {
            currentDate() {
                return moment(new Date()).format('ddd DD MMMM, YYYY');
            }
        },

        methods: {
            weatherClick(weather) {
                this.$router.push({path: `/weather/${weather.woeid}`});
            },
            doSearch(keyword) {
                this.loaded = false;
                getAllWeathers(keyword, (err, weathers) => {
                    if (err) throw err;
                    this.weathers = weathers;
                    this.loaded = true;
                });
            }
        },

        watch: {
            '$route'() {
                this.doSearch(this.$route.params.keyword);
            }
        },

        created() {

            this.doSearch(this.$route.params.keyword);
        }
    }
</script>