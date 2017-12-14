(function () {
    'use strict';

    angular
        .module('PelisEOI')
        .factory('MoviesProvider', MoviesProvider);

    MoviesProvider.$inject = ['$http','$sce'];
    function MoviesProvider($http,$sce) {
        /* __________________________: Variable Declaration :_________________________ */
        var vm = this;
        vm.movieDB = {
            apikey: 'a12bfe59785980541a950a8f80bdb443',
            arrayDiscover: ['popularity', 'release_data', 'revenue', 'primary_release', 'original_title']
        }
        vm.omdb = {
            apikey: '65c34c49'
        }

        /* __________________________: Functions Declaration :_________________________ */
        var service = {
            getGenres: getGenres,
            getPopularMovies: getPopularMovies,
            getTopRated: getTopRated,
            getSuggestedMovies: getSuggestedMovies,
            getDiscoverMovies: getDiscoverMovies,
            getUpcomingMovies: getUpcomingMovies,
            getMovieDetails: getMovieDetails,
            getSimilarMovies: getSimilarMovies
        };

        return service;

        ///////////////////////////////// MAIN FUNTIONS /////////////////////////////////

        function getGenres() {
            return $http.get('https://api.themoviedb.org/3/genre/movie/list?api_key=' + vm.movieDB.apikey + '&language=en-US')
                .then(genresRecived);
        }

        function getPopularMovies() {
            return $http.get('https://api.themoviedb.org/3/movie/popular?api_key=' + vm.movieDB.apikey + '&language=en-US&page=1')
                .then(moviesRecived)
            //.then(getRatings);
        }

        function getSuggestedMovies(search) {
            return $http.get('https://api.themoviedb.org/3/search/movie?api_key=' + vm.movieDB.apikey + '&language=en-US&query=' + search.title + '&page=1&include_adult=false')
                .then(suggestedMoviesRecived)
            //.then(getRatings);
        }

        function getTopRated() {
            return $http.get('https://api.themoviedb.org/3/movie/top_rated?api_key=' + vm.movieDB.apikey + '&language=en-US&page=1')
                .then(moviesRecived)
        }

        function getDiscoverMovies() {
            let randomIndex = parseInt(Math.random() * vm.movieDB.arrayDiscover.length);
            let randomDiscover = vm.movieDB.arrayDiscover[randomIndex];
            return $http.get('https://api.themoviedb.org/3/discover/movie?api_key=' + vm.movieDB.apikey + '&language=en-US&sort_by=' + randomDiscover + '.desc&include_adult=false&include_video=false&page=1')
                .then(moviesRecived)
        }

        function getUpcomingMovies() {
            return $http.get('https://api.themoviedb.org/3/movie/upcoming?api_key=' + vm.movieDB.apikey + '&language=en-US&page=1')
                .then(moviesRecived);
        }

        function getMovieDetails(movieId) {
            return $http.get('https://api.themoviedb.org/3/movie/' + movieId + '?api_key=' + vm.movieDB.apikey + '&language=en-US')
                .then(movieRecived)
                .then(getRating)
                .then(getTrailerMovie);
        }

        function getSimilarMovies(movieId) {
            return $http.get('https://api.themoviedb.org/3/movie/' + movieId + '/similar?api_key=' + vm.movieDB.apikey + '&language=en-US')
                .then(moviesRecived);
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

        // function getRatings(response) {
        //     let movies = response;
        //     let moviesPromises = movies.map(movie => {
        //         return $http.get('http://www.omdbapi.com/?t=' + movie.title + '&y=' + movie.year + '&apikey=' + vm.omdb.apikey)
        //             .then(movieOmbd => addRatings(movieOmbd, movie));
        //     });

        //     return Promise.all(moviesPromises);
        // }

        function getRating(movie) {
            return $http.get('http://www.omdbapi.com/?t=' + movie.title + '&y=' + movie.year + '&apikey=' + vm.omdb.apikey)
                .then(movieOmbd => addRatings(movieOmbd, movie));
        }

        function suggestedMoviesRecived(response) {
            let totalResults = response.data.total_results;
            let movieCards = response.data.results
            let moviesOrdereByPopularity = movieCards.sort((movieNow, movieNext) => movieNext.popularity - movieNow.popularity);
            return {
                totalResults: totalResults,
                movies: applyFormatMovies(moviesOrdereByPopularity)
            }
            // if(moviesOrdereByPopularity.length > 4) moviesOrdereByPopularity = moviesOrdereByPopularity.slice(0, 4);
            // return moviesOrdereByPopularity.map(movie => movie.title);
        }

        function movieRecived(response) {
            let movie = response.data;
            return applyFormatMovie(movie);
        }


        function getTrailerMovie(movie) {
            return $http.get('https://api.themoviedb.org/3/movie/'+movie.id+'/videos?api_key='+vm.movieDB.apikey+'&language=en-US')
                .then(videoRequest => addTrailer(videoRequest,movie))
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
                year: parseInt(movie.release_date),
                genres: movie.genres,
                runtime: {
                    hours: parseInt(movie.runtime / 60),
                    minutes: movie.runtime % 60
                }
            };
        }

        function addRatings(movieOmbd, movie) {
            let omdbRatings = movieOmbd.data.Ratings;
            movie.ratings = {}

            if (!omdbRatings) return movie;
            checkRatingsExist(movie);

            if (omdbRatings[0]) movie.ratings.imdb = parseFloat(omdbRatings[0].Value);
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
            movie.video = $sce.trustAs($sce.RESOURCE_URL, 'https://www.youtube.com/embed/' + arrayVideos[0].key);
            console.log(movie.video)
            return movie;
        }
    }
})();