<template>
  <div>
    <p>{{ currentDate }}</p>

    <div v-if="loaded" class="row">
      <div class="col-sm-6 col-md-4 col-lg-3 mb-4" v-for="(weather, index) in weathers">
        <weather :key="index" :weather="weather" ref="weather" @click="weatherClick"></weather>
      </div>
    </div>
    <div v-else>
      <i class="fa fa-spinner fa-spin"></i> Loading fresh data...
    </div>
  </div>
</template>

<script>
    import {getAllWeathers} from './../js/functions.js';
    import Card from './Card.vue';

    const defaultCities = [
        'Istanbul', 'Berlin', 'London', 'Helsinki', 'Dublin', 'Vancouver'
    ];

    export default {
        data() {
            return {
                weathers: [],
                loaded: false
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
            }
        },
        created() {
            getAllWeathers(defaultCities, (err, weathers) => {
                if (err) throw err;
                this.weathers = weathers;
                this.loaded = true;
            });
        }
    }
</script>