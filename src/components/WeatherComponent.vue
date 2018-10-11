<template>
    <div id="app">
        <header class="card-header align-items-center mb-2">
            <div class="container">
                <div class="row">
                    <div class="col-auto col-lg-4 weather-brand mt-2">
                        <router-link to="/">Weather App</router-link>
                    </div>
                    <div class="col col-lg-4">
                        <form @submit.prevent="searchSubmit" class="search-form m-0">
                            <div class="input-group">
                                <input id="search" type="search" class="form-control" autocomplete="off" placeholder="Search..." v-model="search">
                                <button type="submit"><i class="fa fa-search"></i></button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </header>

        <div class="container">
            <router-view></router-view>
        </div>
    </div>

</template>

<script>
    export default {
        data() {
            return {
                search: '',
            }
        },
        created() {
            console.log('Created');
        },
        methods: {
            searchSubmit() {
                if (this.search.length<1) return;
                this.$router.push({path: `/search/${this.search}`});
            }
        }
    }

</script>