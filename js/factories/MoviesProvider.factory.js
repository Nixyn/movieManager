(function () {
    'use strict';

    angular
        .module('PelisEOI')
        .factory('MoviesProvider', MoviesProvider);

    MoviesProvider.$inject = ['$http', '$sce','UrlMangerProvider'];
    function MoviesProvider($http, $sce,UrlMngr) {
        /* __________________________: Variable Declaration :_________________________ */
        var vm = this;
        vm.movieDB = {
            apikey: 'a12bfe59785980541a950a8f80bdb443'
        }
        vm.omdb = {
            apikey: '65c34c49'
        }

        /* __________________________: Functions Declaration :_________________________ */
        var service = {
            getGenres: getGenres,
            getPopularMovies: getPopularMovies,
            getTopRated: getTopRated,
            getSearchedMovies: getSearchedMovies,
            getDiscoverMovies: getDiscoverMovies,
            getUpcomingMovies: getUpcomingMovies,
            getMovieDetails: getMovieDetails,
            getSimilarMovies: getSimilarMovies,
            getFilteredMovies: getFilteredMovies,
            getMoreMovies: getMoreMovies
        };

        return service;

        ///////////////////////////////// MAIN FUNTIONS /////////////////////////////////
        function getGenres(params) {
            return $http.get(UrlMngr.setGenresList(params)).then(genresRecived);
        }

        function getPopularMovies(params) {
            return $http.get(UrlMngr.setPopularUrl(params)).then(moviesRecived)
        }

        function getSearchedMovies(params) {
            return $http.get(UrlMngr.setSearchedMovies(params))
                .then(searchedMoviesRecived)
        }

        function getTopRated(params) {
            return $http.get(UrlMngr.setTopRated(params))
                .then(moviesRecived)
        }

        function getDiscoverMovies(params) {
            //UrlMngr.loadLazyLoadUrl();
            return $http.get(UrlMngr.setDiscoverMovies(params))
                .then(moviesRecived)
        }

        function getUpcomingMovies(params) {
            return $http.get(UrlMngr.setUpcomingMovies(params))
                .then(moviesRecived);
        }

        function getMovieDetails(movieId,params) {
            console.log(UrlMngr.setMovieDetails(movieId,params))
            return $http.get(UrlMngr.setMovieDetails(movieId,params))
                .then(movieRecived)
                .then(getRating)
                .then(getTrailerMovie);
        }

        function getSimilarMovies(movieId,params) {
            return $http.get(UrlMngr.setSimilarMovies(movieId,params))
                .then(moviesRecived);
        }

        function getFilteredMovies(params) {
            return $http.get(UrlMngr.setFilteredMovies(params))
                .then(moviesRecived);
        }

        function getMoreMovies() { 
            UrlMngr.loadLazyLoadUrl();
            return $http.get(UrlMngr.getLazyLoadUrl())
                .then(moviesRecived)
        }

        ////////////////////////////// SECUNDARY FUNTIONS //////////////////////////////

        function genresRecived(response) {
            let genres = response.data.genres;
            return genres;
        }

        function moviesRecived(response) {
            let totalResults = response.data.total_results;
            let movieCards = response.data.results
            return {
                totalResults: totalResults,
                movies: applyFormatMovies(movieCards)
            }
        }

        function getRating(movie) {
            return $http.get('http://www.omdbapi.com/?t=' + movie.title + '&y=' + movie.year + '&apikey=' + vm.omdb.apikey)
                .then(movieOmbd => addRatings(movieOmbd, movie));
        }

        function searchedMoviesRecived(response) {
            let totalResults = response.data.total_results;
            let movieCards = response.data.results;
            let moviesOrdereByPopularity = movieCards.sort((movieNow, movieNext) => movieNext.popularity - movieNow.popularity);

            return {
                totalResults: totalResults,
                movies: applyFormatMovies(moviesOrdereByPopularity)
            }
        }

        function movieRecived(response) {
            let movie = response.data;
            return applyFormatMovie(movie);
        }

        function getTrailerMovie(movie) {
            return $http.get('https://api.themoviedb.org/3/movie/' + movie.id + '/videos?api_key=' + vm.movieDB.apikey + '&language=en-US')
                .then(videoRequest => addTrailer(videoRequest, movie))
        }

        ///////////////////////////////// AUX FUNTIONS /////////////////////////////////        

        function applyFormatMovies(moviesArray) {
            return moviesArray.map(movie => movie = {
                id: movie.id,
                title: movie.title,
                poster: 'https://image.tmdb.org/t/p/w640' + movie.poster_path,
                year: parseInt(movie.release_date),
                genreIds: movie.genre_ids
            });
        }

        function applyFormatMovie(movie) {
            return movie = {
                id: movie.id,
                title: movie.title,
                poster: 'https://image.tmdb.org/t/p/w640' + movie.poster_path,
                overview: movie.overview,
                year: parseInt(movie.release_date),
                genres: movie.genres,
                runtime: {
                    hours: parseInt(movie.runtime / 60),
                    minutes: movie.runtime % 60
                },
                ratings: {
                    imdb: movie.vote_average
                }
            };
        }

        function addRatings(movieOmbd, movie) {
            let omdbRatings = movieOmbd.data.Ratings;

            if (!omdbRatings) return movie;
            checkRatingsExist(movie);

            if (omdbRatings[1]) movie.ratings.rotten = parseFloat(omdbRatings[1].Value);
            if (omdbRatings[2]) movie.ratings.metacritic = parseFloat(omdbRatings[2].Value);
            return movie;
        }

        function checkRatingsExist(movie) {
            if (!movie.ratings.metacritic) movie.ratings.metacritic = 0;
            if (!movie.ratings.rotten) movie.ratings.rotten = 0;
            if (!movie.ratings.imdb) movie.ratings.imdb = 0;
        }

        function addTrailer(videoRequest, movie) {
            let arrayVideos = videoRequest.data.results;
            console.log(videoRequest)
            if (arrayVideos.length > 0)
                movie.video = $sce.trustAs($sce.RESOURCE_URL, 'https://www.youtube.com/embed/' + arrayVideos[0].key);

            return movie;
        }
    }
})();