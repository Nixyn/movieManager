(function () {
    'use strict';

    angular
        .module('PelisEOI')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['MoviesProvider'];
    function HomeController(MoviesProvider) {
        /* __________________________: Variables Declaration :_________________________ */
        var vm = this;
        vm.genres = [];
        vm.movies = [];
        vm.search = {};
        vm.similarMovies = [];
        vm.requestSearchMovieByTitle = false;
        vm.movieSelected = false;
        vm.totalResults = 0;
        vm.loadMovies = false;

        /* __________________________: Functions Declaration :_________________________ */
        vm.searchMovieByTitle = searchMovieByTitle;
        vm.getPopularMovies = getPopularMovies;
        vm.getTopRated = getTopRated;
        vm.getDiscoverMovies = getDiscoverMovies;
        vm.getUpcomingMovies = getUpcomingMovies;
        vm.getMovieDetails = getMovieDetails;
        vm.closeMovieDetails = closeMovieDetails;
        vm.deleteSearch = deleteSearch;

        activate();


        //////////////////////////////// MAIN FUNTIONS ////////////////////////////////
        function activate() {
            MoviesProvider.getGenres().then(response => vm.genres = response);
            getPopularMovies();
        }

        function searchMovieByTitle() {
            if (vm.requestSearchMovieByTitle) return;
            if (!vm.search.title) {
                vm.search.title = "";
                return;
            }
            vm.requestSearchMovieByTitle = true;
            setTimeout(() => {
                MoviesProvider.getSuggestedMovies(vm.search).then(moviesRecived);
                vm.requestSearchMovieByTitle = false;
            }, 300)
        }

        function getPopularMovies() {
            MoviesProvider.getPopularMovies().then(moviesRecived);
            cleanSearch();
        }

        function getTopRated() {
            MoviesProvider.getTopRated().then(moviesRecived);
            cleanSearch();
        }

        function getDiscoverMovies() {
            MoviesProvider.getDiscoverMovies().then(moviesRecived);
            cleanSearch();
        }

        function getUpcomingMovies() {
            MoviesProvider.getUpcomingMovies().then(moviesRecived);
            cleanSearch();
        }

        function deleteSearch() {
            getPopularMovies();
        }

        function getMovieDetails(movieId) {
            vm.movieSelected = true;
            MoviesProvider.getMovieDetails(movieId).then(response => vm.movieSelected = response);
            MoviesProvider.getSimilarMovies(movieId).then(similarMoviesRecived);
            disableMainScroll();
        }

        function closeMovieDetails() {
            vm.movieSelected = false;
            enableMainScroll();
        }

        //////////////////////////////// AUX FUNTIONS ////////////////////////////////
        function cleanSearch() {
            vm.search = {};
        }

        function moviesRecived(response) {
            vm.movies = response.movies;
            vm.totalResults = response.totalResults;
        }

        function similarMoviesRecived(response) {
            vm.similarMovies = response.movies;
            vm.totalResults = response.totalResults;
        }

        function lazyLoadOfMovies() {
            let ngScope = document.querySelector('.ng-scope');
            let scrollPosition = ngScope.scrollTop + ngScope.clientHeight;
            let finalScrollPosition = ngScope.scrollHeight;
            if (scrollPosition === finalScrollPosition) vm.loadMovies = true;
            console.log(vm.loadMovies)
        }

        function disableMainScroll() {
            let ngScope = document.querySelector('.ng-scope');
            ngScope.classList.add('no-scrollable');
            // this.movieDetails.classList.add('animated');
        }

        function enableMainScroll() {
            let ngScope = document.querySelector('.ng-scope');
            ngScope.classList.remove('no-scrollable');
        }

        /////////////////////////////// EVENT LISTENER ///////////////////////////////
        window.addEventListener('scroll', function (e) {
            lazyLoadOfMovies();
        });

}
}) ();

