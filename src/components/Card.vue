<template>
    <div @click="getMore" class="card weather-card">
        <div class="card-body">
            <div class="col mb-2 text-center">
                <h3 class="weather-city mb-3">{{ weather.title }}</h3>
                <div v-if="weatherData.the_temp">
                    <img :src="getIcon(weatherData)" width="100">
                    <p>{{ weatherData.weather_state_name }}</p>
                </div>
                <div v-else class="weather-nodata-icon">
                    <i class="fa fa-meh-o" aria-hidden="true"></i>
                </div>

            </div>

            <div v-if="weatherData.the_temp">
                Temp: {{ Math.round(weatherData.the_temp)}}°C<br>
                Temp max: {{ Math.round(weatherData.max_temp)}}°C<br>
                Temp min: {{ Math.round(weatherData.min_temp)}}°C<br>
            </div>
            <div v-else>Unfortunately, we haven't data about today weather, but you can click and see info for other days</div>

        </div>
    </div>
</template>
<script>
    import {getIcon} from './../js/functions.js';
    import './../js/functions.js';
    export default {
        props: ['weather'],
        data(){ return {}},
        computed: {
            weatherData()
            {
                let date = moment(new Date()).format('YYYY-MM-DD');
                return this.weather.consolidated_weather.filter(day => day.applicable_date === date)[0] || {};
            }
        },
        methods: {
            getIcon ,
            getMore()
            {
                this.$emit('click', this.weather);
            }
        }
    }
</script>