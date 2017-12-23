(function () {
    'use strict';

    angular
        .module('PelisEOI')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['MoviesProvider', '$scope', 'firebaseProvider'];
    function HomeController(MoviesProvider, $scope, FBP) {
        /* __________________________: Variables Declaration :_________________________ */
        var vm = this;
        vm.genres = [];
        vm.movies = [];
        vm.search = {};
        vm.similarMovies = [];
        vm.requestSearchMovieByTitle = false;
        vm.isMovieSelected = false;
        vm.movieSelected = {};
        vm.totalResults = 0;
        vm.loadMovies = false;
        vm.isSliderChanged = false;
        vm.isUserSingIn = false;
        vm.isViewOwnMovies = false;
        vm.currentUser = {
            favMovies: [],
            viewMovies: [],
            moviesToWatch: []
        };
        vm.sliderYear = {
            minValue: 1950,
            maxValue: 2018,
            options: {
                floor: 1950,
                ceil: 2018,
                step: 1,
                onEnd: function () {
                    vm.getFilteredMovies();
                }
            }
        };

        vm.sliderAverage = {
            minValue: 0,
            maxValue: 10,
            options: {
                floor: 0,
                ceil: 10,
                step: 1,
                onEnd: function () {
                    vm.getFilteredMovies();
                }
            }
        };

        vm.filterParams = {
            title: vm.search.title,
            language: 'es',
            country: 'US',
            sort_by: 'popularity.desc',
            adultContent: false,
            videoContent: false,
            smallerYear: vm.sliderYear.minValue,
            largerYear: vm.sliderYear.maxValue,
            smallerAverage: vm.sliderAverage.minValue,
            largerAverage: vm.sliderAverage.maxValue,
            genresFilter: []
        }

        /* __________________________: Functions Declaration :_________________________ */
        vm.searchMovieByTitle = searchMovieByTitle;
        vm.getPopularMovies = getPopularMovies;
        vm.getTopRated = getTopRated;
        vm.getDiscoverMovies = getDiscoverMovies;
        vm.getUpcomingMovies = getUpcomingMovies;
        vm.getMovieDetails = getMovieDetails;
        vm.closeMovieDetails = closeMovieDetails;
        vm.deleteSearch = deleteSearch;
        vm.getFilteredMovies = getFilteredMovies;
        vm.checkButtonGenre = checkButtonGenre;
        vm.showSingIn = showSingIn;
        vm.singIn = singIn;
        vm.singOut = singOut;
        vm.addFav = addFav;
        vm.addViewMovies = addViewMovies;
        vm.addMoviesToWatch = addMoviesToWatch;
        vm.showFav = showFav;
        vm.showViewMovies = showViewMovies;
        vm.showMoviesToWatch = showMoviesToWatch;
        vm.checkFavMovies = checkFavMovies;
        vm.checkViewMovie = checkViewMovie
        vm.checkMoviesToWatch = checkMoviesToWatch

        activate();


        //////////////////////////////// MAIN FUNTIONS ////////////////////////////////
        function activate() {
            MoviesProvider.getGenres(vm.filterParams).then(response => vm.genres = response);
            getPopularMovies();

            var user = firebase.auth().currentUser;
            if (user) {
                FBP.loadUser().then(response => {
                    vm.currentUser = response;
                    vm.currentUser.uid = response.uid;
                    vm.isUserSingIn = true;

                });
            }
        }

        function searchMovieByTitle() {
            if (vm.requestSearchMovieByTitle) return;
            if (vm.search.title == '') { getPopularMovies(); return; }
            if (!vm.search.title) { vm.search.title = ""; return; }

            vm.requestSearchMovieByTitle = true;
            setTimeout(() => {
                vm.requestSearchMovieByTitle = false;
                if (vm.search.title == '') { getPopularMovies(); return; }
                vm.filterParams.title = vm.search.title;
                MoviesProvider.getSearchedMovies(vm.filterParams).then(moviesRecived);
                withoutDashboard();
            }, 300)
        }

        function getPopularMovies() {
            MoviesProvider.getPopularMovies(vm.filterParams).then(moviesRecived);
            withDashboard();
        }

        function getTopRated() {
            MoviesProvider.getTopRated(vm.filterParams).then(moviesRecived);
            withoutDashboard();

        }

        function getDiscoverMovies() {
            MoviesProvider.getDiscoverMovies(vm.filterParams).then(moviesRecived);
            withDashboard();
        }

        function getUpcomingMovies() {
            MoviesProvider.getUpcomingMovies(vm.filterParams).then(moviesRecived);
            withoutDashboard();

        }

        function deleteSearch() {
            vm.filterParams.genresFilter = [];
            vm.sliderYear.minValue = 1950;
            vm.sliderYear.maxValue = 2018;
            vm.sliderAverage.minValue = 0;
            vm.sliderAverage.maxValue = 10;
            getPopularMovies();
        }

        function getMovieDetails(movieId) {
            vm.isMovieSelected = true;
            MoviesProvider.getMovieDetails(movieId,vm.filterParams).then(response => vm.movieSelected = response);
            MoviesProvider.getSimilarMovies(movieId,vm.filterParams).then(response => vm.similarMovies = response.movies);
            disableMainScroll();
        }

        function closeMovieDetails() {
            vm.isMovieSelected = false;
            enableMainScroll();
        }

        function getFilteredMovies(genreId = null) {
            let toggle = checkButtonGenre(genreId);
            if (!toggle) vm.filterParams.genresFilter.push(genreId);
            if (toggle) vm.filterParams.genresFilter = vm.filterParams.genresFilter.filter(valor => valor != genreId);

            vm.filterParams.smallerYear = vm.sliderYear.minValue;
            vm.filterParams.largerYear = vm.sliderYear.maxValue;
            vm.filterParams.smallerAverage = vm.sliderAverage.minValue;
            vm.filterParams.largerAverage = vm.sliderAverage.maxValue;

            MoviesProvider.getFilteredMovies(vm.filterParams).then(moviesRecived);
        }

        function checkButtonGenre(genreId) {
            let isExistGenre = vm.filterParams.genresFilter.filter(element => element == genreId);
            if (isExistGenre.length > 0) return true;
            return false;
        }

        function checkFavMovies(movieId) {
            if (!vm.currentUser.favMovies) vm.currentUser.favMovies = [];                        
            let isMovieFav = vm.currentUser.favMovies.filter(movie => movie.id === movieId);
            if (isMovieFav.length > 0) return true;
            return false;
        }

        function checkViewMovie(movieId) {
            if (!vm.currentUser.viewMovies) vm.currentUser.viewMovies = [];            
            let isMovieViewed = vm.currentUser.viewMovies.filter(movie => movie.id === movieId);
            if (isMovieViewed.length > 0) return true;
            return false;
        }

        function checkMoviesToWatch(movieId) {
            if (!vm.currentUser.moviesToWatch) vm.currentUser.moviesToWatch = [];            
            let isMoviesToWatch = vm.currentUser.moviesToWatch.filter(movie => movie.id === movieId);
            if (isMoviesToWatch.length > 0) return true;
            return false;
        }

        function showSingIn() {
            let singInNav = document.querySelector('.singIn-nav');
            singInNav.style.display = 'flex';
            singInNav.classList.add('animated');
            singInNav.classList.add('slideInDown');
            singInNav.addEventListener("animationend", function () {
                singInNav.style.zIndex = 1;
            }, false);
        }

        function singIn() {
            FBP.singInUser(vm.currentUser).then(response => {
                let uidUser = response.uid
                if (response.uid) {
                    vm.isUserSingIn = true;
                    FBP.loadUser().then(response => {
                        vm.currentUser = response;
                        vm.currentUser.uid = uidUser;

                    });
                }

                $scope.$apply();
            });;

            let singInNav = document.querySelector('.singIn-nav');
            singInNav.style.zIndex = -1;
            singInNav.classList.add('slideOutUp');
            singInNav.addEventListener("animationend", function () {
                singInNav.style.display = 'none';
            }, false);

        }

        function singOut() {
            vm.isUserSingIn = false;
            getPopularMovies();
            FBP.singOutUser();
        }

        function addFav(movieId) {
            let movie = vm.movies.find(movie => movie.id === movieId);
            if (vm.currentUser.favMovies.includes(movie)) return;
            if (!vm.currentUser.favMovies) vm.currentUser.favMovies = [];
            console.log(vm.currentUser)
            vm.currentUser.favMovies.push(movie);
            FBP.updateUser(vm.currentUser);
        }

        function addViewMovies(movieId) {
            let movie = vm.movies.find(movie => movie.id === movieId);
            if (vm.currentUser.viewMovies.includes(movie)) return;
            if (!vm.currentUser.viewMovies) vm.currentUser.viewMovies = [];
            vm.currentUser.viewMovies.push(movie);
            FBP.updateUser(vm.currentUser);
        }

        function addMoviesToWatch(movieId) {
            let movie = vm.movies.find(movie => movie.id === movieId);
            if (vm.currentUser.moviesToWatch.includes(movie)) return;
            if (!vm.currentUser.moviesToWatch) vm.currentUser.moviesToWatch = [];
            vm.currentUser.moviesToWatch.push(movie);
            FBP.updateUser(vm.currentUser);
        }

        function showFav() {
            vm.movies = vm.currentUser.favMovies;
            vm.isViewOwnMovies = true;
            withoutDashboard();
        }

        function showViewMovies() {
            vm.movies = vm.currentUser.viewMovies;
            vm.isViewOwnMovies = true;
            withoutDashboard();
        }

        function showMoviesToWatch() {
            vm.movies = vm.currentUser.moviesToWatch;
            vm.isViewOwnMovies = true;
            withoutDashboard();
        }

        //////////////////////////////// AUX FUNTIONS ////////////////////////////////
        function cleanSearch() {
            vm.search = {};
        }

        function moviesRecived(response) {
            vm.movies = response.movies;
            console.log(vm.movies)
            vm.totalResults = response.totalResults;
        }

        function newMoviesRecived(newMovies) {
            vm.movies = vm.movies.concat(newMovies.movies)
            vm.loadMovies = false;
            console.log(vm.movies)
        }

        function lazyLoadOfMovies() {
            let ngScope = document.querySelector('.ng-scope');
            let scrollPosition = ngScope.scrollTop + ngScope.clientHeight + 20;
            let finalScrollPosition = ngScope.scrollHeight;

            if (vm.loadMovies) return;

            if (scrollPosition >= finalScrollPosition) {
                vm.loadMovies = true;
                MoviesProvider.getMoreMovies().then(newMoviesRecived); //TODO: cargar getMoreMovies()

            }
            $scope.$apply();
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

        function withoutDashboard() {
            let dashboard = document.querySelector('.dashboard');
            let filmShowcase = document.querySelector('.filmShowcase');
            let filmShowcaseShowcase = document.querySelector('.filmShowcase__showcase');
            dashboard.style.display = 'none';
            filmShowcase.style.width = '95%';
            filmShowcaseShowcase.style.justifyContent = 'center';
        }

        function withDashboard() {
            let dashboard = document.querySelector('.dashboard');
            let filmShowcase = document.querySelector('.filmShowcase');
            let filmShowcaseShowcase = document.querySelector('.filmShowcase__showcase');
            dashboard.style.display = 'block';
            filmShowcase.style.width = '77%';
            filmShowcaseShowcase.style.justifyContent = 'flex-start';
            vm.isViewOwnMovies = false;
            cleanSearch();
        }
        /////////////////////////////// EVENT LISTENER ///////////////////////////////
        window.addEventListener('scroll', function (e) {
            lazyLoadOfMovies();
        });

    }
})();

