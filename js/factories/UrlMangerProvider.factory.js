(function () {
    'use strict';

    angular
        .module('PelisEOI')
        .factory('UrlMangerProvider', UrlMangerProvider);

    UrlMangerProvider.$inject = [];
    function UrlMangerProvider() {
        /* __________________________: Variable Declaration :_________________________ */
        var vm = this;
        vm.objUrl = {};
        vm.movieDB = {
            apikey: 'a12bfe59785980541a950a8f80bdb443',
            numPage: 1,
            arrayDiscover: ['popularity.desc', 'release_date.desc', 'primary_release_date.desc', 'original_title.desc', 'vote_average.desc', 'vote_count.desc'],
            dataUrl: {
                url: '',
                pre_url: '',
                lazyLoadUrl: ''
            }
        }
        /* __________________________: Functions Declaration :_________________________ */
        var service = {
            loadLazyLoadUrl: loadLazyLoadUrl,
            getLazyLoadUrl: getLazyLoadUrl,
            setGenresList: setGenresList,
            setPopularUrl: setPopularUrl,
            setSearchedMovies: setSearchedMovies,
            setTopRated: setTopRated,
            setUpcomingMovies: setUpcomingMovies,
            setDiscoverMovies:setDiscoverMovies,
            setMovieDetails: setMovieDetails,
            setSimilarMovies: setSimilarMovies,
            setFilteredMovies: setFilteredMovies

        };

        return service;

        ///////////////////////////////// MAIN FUNTIONS /////////////////////////////////
        function loadLazyLoadUrl() {
            vm.movieDB.numPage++;
            vm.movieDB.dataUrl.lazyLoadUrl = vm.movieDB.dataUrl.pre_url + '&page=' + vm.movieDB.numPage;
            return vm.movieDB.dataUrl.lazyLoadUrl;
        }

        function getLazyLoadUrl() {
            return vm.movieDB.dataUrl.lazyLoadUrl;
        }

        function setGenresList(params) {
            let queryArray = urlConstructor(params).join('&');

            vm.objUrl.endPoint = 'genre';
            vm.objUrl.type = 'list';
            loadUrlSections(queryArray);

            return vm.movieDB.dataUrl.url;
        }

        function setPopularUrl(params) {
            let queryArray = urlConstructor(params).join('&');

            vm.objUrl.endPoint = 'movie';
            vm.objUrl.type = 'popular';

            loadUrlSections(queryArray);
            return vm.movieDB.dataUrl.url;
        }

        function setSearchedMovies(params) {
            let queryArray = urlConstructor(params).concat([
                vm.objUrl.title
            ]).join('&');

            vm.objUrl.endPoint = 'search';
            vm.objUrl.type = 'movie';

            loadUrlSections(queryArray);
            return vm.movieDB.dataUrl.url;
        }

        function setTopRated(params) {
            let queryArray = urlConstructor(params).join('&');

            vm.objUrl.endPoint = 'movie';
            vm.objUrl.type = 'top_rated';

            loadUrlSections(queryArray);
            return vm.movieDB.dataUrl.url;
        }

        function setUpcomingMovies(params) {
            let queryArray = urlConstructor(params).join('&');

            vm.objUrl.endPoint = 'movie';
            vm.objUrl.type = 'upcoming';

            loadUrlSections(queryArray);
            return vm.movieDB.dataUrl.url;
        }

        function setDiscoverMovies(params) {
            let randomIndex = parseInt(Math.random() * vm.movieDB.arrayDiscover.length);
            let randomDiscover = vm.movieDB.arrayDiscover[randomIndex];
            let queryArray = urlConstructor(params).concat(['sort_by=' + randomDiscover]).join('&');
            console.log(randomIndex)
            vm.objUrl.endPoint = 'discover';
            vm.objUrl.type = 'movie';

            loadUrlSections(queryArray);
            return vm.movieDB.dataUrl.url;
        }

        function setFilteredMovies(params) {
            let queryArray = urlConstructor(params).concat([
                vm.objUrl.smallerYear,
                vm.objUrl.largerYear,
                vm.objUrl.smallerAverage,
                vm.objUrl.largerAverage,
                vm.objUrl.genresUrl
            ]).join('&');

            vm.objUrl.endPoint = 'discover';
            vm.objUrl.type = 'movie';

            loadUrlSections(queryArray);
            return vm.movieDB.dataUrl.url;
        }

        function setMovieDetails(movieId, params) {
            let queryArray = urlConstructor(params).join('&');

            vm.objUrl.endPoint = 'movie';
            vm.objUrl.type = movieId;

            vm.movieDB.dataUrl.url = vm.objUrl.urlBase + vm.objUrl.endPoint + '/' + vm.objUrl.type + '?' + queryArray;
            return vm.movieDB.dataUrl.url;
        }

        function setSimilarMovies(movieId, params) {
            let queryArray = urlConstructor(params).join('&');

            vm.objUrl.endPoint = 'movie';
            vm.objUrl.type = 'similar';

            vm.movieDB.dataUrl.url = vm.objUrl.urlBase + vm.objUrl.endPoint + '/' + movieId + '/' + vm.objUrl.type + '?' + queryArray + vm.movieDB.dataUrl.pre_url + '&' + vm.objUrl.page;
            return vm.movieDB.dataUrl.url;
        }

        ///////////////////////////////// AUX FUNTIONS /////////////////////////////////
        function urlConstructor(params) {
            vm.objUrl = {
                urlBase: 'https://api.themoviedb.org/3/',
                endPoint: 'movie',
                type: 'popular',
                apikey: 'api_key=' + vm.movieDB.apikey,
                language: 'language=' + params.language + '-US',
                sort_by: 'sort_by=' + params.sort_by,
                title: 'query=' + params.title,
                adultContent: 'include_adult=' + params.adultContent,
                videoContent: 'include_video=' + params.videoContent,
                smallerYear: 'release_date.gte=' + params.smallerYear + '-01-01',
                largerYear: 'release_date.lte=' + params.largerYear + '-12-31',
                smallerAverage: 'vote_average.gte=' + params.smallerAverage,
                largerAverage: 'vote_average.lte=' + params.largerAverage,
                genresUrl: 'with_genres=' + params.genresFilter.toString().replace(/,/gi, '%2C'),
                page: 'page=' + vm.movieDB.numPage //quitar
            }

            let queryArray = [vm.objUrl.apikey, vm.objUrl.language, vm.objUrl.adultContent, vm.objUrl.videoContent]
            return queryArray
        }

        function checkChangeOfUrlToResetNumPage() {
            let isNotSameUrlAsBefore = vm.movieDB.dataUrl.lazyLoadUrl.indexOf(vm.movieDB.dataUrl.pre_url);
            console.log(vm.movieDB.dataUrl.lazyLoadUrl)
            console.log(vm.movieDB.dataUrl.pre_url)
            if (isNotSameUrlAsBefore === -1) vm.movieDB.numPage = 1;
        }

        function loadUrlSections(queryArray) {
            vm.movieDB.dataUrl.pre_url = vm.objUrl.urlBase + vm.objUrl.endPoint + '/' + vm.objUrl.type + '?' + queryArray;
            checkChangeOfUrlToResetNumPage();
            vm.movieDB.dataUrl.url = vm.movieDB.dataUrl.pre_url + '&' + 'page=' + vm.movieDB.numPage;
        }



    }
})();