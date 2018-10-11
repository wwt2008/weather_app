<template>
    <div v-if="weather">
        <p>
            <a href="#" @click.prevent="back">
                <i class="fa fa-arrow-left" aria-hidden="true"></i> Go back
            </a>
        </p>

        <div class="h2 mb-4">{{ weather.title }}</div>
        <div v-if="loaded" class="card card-body">
            <div class="row">
                <div class="col-sm-6 col-md-4 col-lg-3 p-2" v-for="(item, index) in weather.consolidated_weather">
                        <div :key="index" :class="isCurrentDate(item) ? 'shadow border border-success' : null" class="card weather-card-extra">
                            <div class="card-body">
                                <div class="col mb-2 text-center">
                                    <h3 class="weather-date mb-3">{{ getDate(item.applicable_date) }}</h3>
                                    <img :src="getIcon(item)" width="100">
                                    <p>{{ item.weather_state_name }}</p>
                                </div>
                                <ul class="list-group" v-for="prop in getPropArr(index)">
                                    <li class="list-group-item">{{prop}}</li>
                                </ul>
                            </div>
                        </div>
                </div>
            </div>
        </div>
        <div v-else>
            <i class="fa fa-spinner fa-spin"></i> Loading fresh data...
        </div>
    </div>
</template>

<script>
    import {getIcon} from './../js/functions';
    import {getWeather} from './../js/functions';
    export default {
        data() {
            return {
                weather: null,
                propArr : [
                    {name: "Temp max", code: "max_temp", unit:"°C", func:"round"},
                    {name: "Temp min", code: "min_temp", unit:"°C", func:"round"},
                    {name: "Wind speed", code: "wind_speed", unit:"m/s", func:"round"},
                    {name: "Wind direction", code: "wind_direction_compass", unit:"", func:""},
                    {name: "Air pressure", code: "item.air_pressure", unit:"mb", func:"round"},
                    {name: "Humidity", code: "humidity", unit:"%", func:"round"},
                    {name: "Visibility", code: "visibility", unit:"m", func:"round"}
                ],
                loaded: false
            };
        },
        methods: {
            back() {
                this.$router.go(-1);
            },
            getIcon,
            getDate(date) {
                return moment(date).format('dddd, D MMM');
            },
            isCurrentDate(item) {
                return item.applicable_date === moment().format('YYYY-MM-DD');
            },
            getPropArr(index){
                let res =[];
                this.propArr.forEach((prop)=>{
                    if(prop.code in this.weather.consolidated_weather[index]){
                        let initVal = this.weather.consolidated_weather[index][prop.code];
                        let val='';
                        if(prop.func === 'round') val = Math.round(initVal);
                        else val = initVal;
                        res.push(prop.name+': '+ val +' '+prop.unit);
                    }
                });
                return res
            }
        },
        created() {
            getWeather(this.$route.params.woeid, (err, weather) => {
                this.loaded = false;
                if (err) throw err;
                this.weather = weather;
                this.loaded = true;
            });
        }
    }
</script>