import WeatherComponent from './../components/WeatherComponent.vue';
import Home from './../components/Home.vue';
import City from './../components/City.vue';
import Search from './../components/Search.vue';
Vue.use(VueRouter);
const router = new VueRouter({
    routes: [
        {path: '/', component: Home},
        {path: '/weather/:woeid', component: City},
        {path: '/search/:keyword', component: Search},
    ]
});
const app = new Vue({
    el: '#app',
    components: {
        WeatherComponent
    },
    router: router,
    render: h => h(WeatherComponent)
});
