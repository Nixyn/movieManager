(function () {
    'use strict';

    // Usage:
    // 
    // Creates:
    // 

    angular
        .module('PelisEOI')
        .component('movieCard', {
            templateUrl: '/movieManager/components/movieCard/movieCard.html',
            controller: movieCardController,
            controllerAs: 'movieCard',
            bindings: {
                movie: '<',
                getDetails: '&',
                movies: '<',
                currentUser: '='
            },
        });

    movieCardController.$inject = ['MoviesProvider', 'firebaseProvider','$scope'];
    function movieCardController(MoviesProvider, FBP, $scope) {
        var movieCard = this;

        movieCard.addFav = addFav;
        movieCard.addViewMovies = addViewMovies;
        movieCard.addMoviesToWatch = addMoviesToWatch;
        movieCard.checkFavMovies = checkFavMovies;
        movieCard.checkViewMovie = checkViewMovie
        movieCard.checkMoviesToWatch = checkMoviesToWatch;

        //////////////////////////////// MAIN FUNTIONS ////////////////////////////////

        movieCard.$onInit = function () { };
        movieCard.$onChanges = function (changesObj) { 
        };
        movieCard.$onDestroy = function () { };

        function addFav(movieId) {
            let toggle = checkFavMovies(movieId);
            let movie = movieCard.movies.find(movie => movie.id === movieId);

            if (!toggle)  movieCard.currentUser.favMovies.push(movie);
            if (toggle) movieCard.currentUser.favMovies = movieCard.currentUser.favMovies.filter(favMovie => favMovie.id != movieId);

            FBP.updateUser(movieCard.currentUser);
        }

        function addViewMovies(movieId) {
            let toggle = checkViewMovie(movieId);
            let movie = movieCard.movies.find(movie => movie.id === movieId);

            if (!toggle)  movieCard.currentUser.viewMovies.push(movie);
            if (toggle) movieCard.currentUser.viewMovies = movieCard.currentUser.viewMovies.filter(viewMovie => viewMovie.id != movieId);

            FBP.updateUser(movieCard.currentUser);
        }

        function addMoviesToWatch(movieId) {
            let toggle = checkMoviesToWatch(movieId);
            let movie = movieCard.movies.find(movie => movie.id === movieId);

            if (!toggle)  movieCard.currentUser.moviesToWatch.push(movie);
            if (toggle) movieCard.currentUser.moviesToWatch = movieCard.currentUser.moviesToWatch.filter(movieToWatch => movieToWatch.id != movieId);

            FBP.updateUser(movieCard.currentUser);
        }

        function checkFavMovies(movieId) {
            if (!movieCard.currentUser.favMovies) movieCard.currentUser.favMovies = [];
            let isMovieFav = movieCard.currentUser.favMovies.filter(movie => movie.id === movieId);
            if (isMovieFav.length > 0) return true;
            return false;
        }

        function checkViewMovie(movieId) {
            if (!movieCard.currentUser.viewMovies) movieCard.currentUser.viewMovies = [];
            let isMovieViewed = movieCard.currentUser.viewMovies.filter(movie => movie.id === movieId);
            if (isMovieViewed.length > 0) return true;
            return false;
        }

        function checkMoviesToWatch(movieId) {
            if (!movieCard.currentUser.moviesToWatch) movieCard.currentUser.moviesToWatch = [];
            let isMoviesToWatch = movieCard.currentUser.moviesToWatch.filter(movie => movie.id === movieId);
            if (isMoviesToWatch.length > 0) return true;
            return false;
        }

        //////////////////////////////// AUX FUNTIONS /////////////////////////////////
        let movieCard__stadistics = document.querySelectorAll('.movieCard__stadistics');
        movieCard__stadistics.forEach(movieCard__stadistic => movieCard__stadistic.addEventListener('click', function (event) {
            event.stopPropagation();
        }, false));

    }
})();