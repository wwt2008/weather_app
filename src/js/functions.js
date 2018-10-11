let mode = 'build'

function getCityData(keyword, func) {
    axios.get(`/weather.php?command=search&keyword=${keyword}`).then(res => {

        //Handle errors
        if (res.data.error) return (res.data.error);
        if (res.status !== 200) return func(res);

        return func(null,res.data);
    });
}

function getWeatherData(woeid, func) {
    axios.get(`/weather.php?command=location&woeid=${woeid}`).then(res => {

        //Handle errors
        if (res.status !== 200) return func(res);
        if (res.data.error) return (res.data.error);

        return func(null, res.data);
    }).catch(res => {
        func(res.response.data);
    });
}

export function getCity(keyword, func) {
    let cities = localstorage.get('cities') || [];
    cities = cities.filter(city => city);
    //Check is city in local storage
    let city = cities.find(city => {
        return city.title.toLowerCase() === keyword.toLowerCase();
    });
    if (city) {
        if(mode === 'dev') console.log('Get city data from local storage', city);
        return func(null, city);
    }
    //Get info about city from web site
    getCityData(keyword, (err, res) => {
        if (err) return func(err);
        //Save new cities object to local storage
        cities.push(res[0]);
        localstorage.set('cities', cities);
        if(mode === 'dev') console.log('Get city data from web site', res[0]);
        func(null, res[0]);
    });
}

export function getWeather(woeid, func) {
    const cityId = 'city_' + woeid;
    let weather = localstorage.get(cityId);

    if (weather) {
        if(mode === 'dev') console.log('Get weather data from local storage');
        return func(null, weather);
    }
    if(mode === 'dev') console.log('Get weather data from web site');
    getWeatherData(woeid, function (err, weather) {
        if (err) return func(err);

        //Save to local storage (expires in 1 minute)
        localstorage.set(cityId, weather, 1);
        func(null, weather);
    });
}
export function getAllWeathers(keywords, func) {
    //If keyword is from Search (string) than get objects with info about cities
    if(typeof keywords === 'string')
        async.waterfall([
            //Get info about matched cities
            func => getCityData(keywords, (err, res) => {
                if (err) return func(err);
                func(null, res.slice(0,10));
            }),
            //Check cities and remove empty
            (cities, func) => {
                cities = cities.filter(city => city);
                func(null, cities);
            },
            //Get weather data for all cities
            (cities, func) => {
                async.map(cities, (city, func) => {
                    getWeather(city.woeid, (err, weather) => {
                        if (err) return func(err);
                        func(null, weather); //weather object includes city data
                    });
                }, func);
            }
        ], func);
    else
    //If keyword is from Home (array) than get get object with info about city for every element
        async.waterfall([
        //Get info about cities from the array
        func => {
            async.map(keywords, (keyword, func) => {
                getCity(keyword, func);
            }, func);
        },
        //Check cities and remove empty
        (cities, func) => {
            cities = cities.filter(city => city);
            func(null, cities);
        },

        (cities, func) => {
            async.map(cities, (city, func) => {
                getWeather(city.woeid, (err, weather) => {
                    if (err) return func(err);
                    func(null, weather); //weather object includes city data
                });
            }, func);
        }

    ], func);
}

export function getIcon(data) {
    return `https://www.metaweather.com/static/img/weather/${data.weather_state_abbr}.svg`;
}