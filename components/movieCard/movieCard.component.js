(function () {
    'use strict';

    // Usage:
    // 
    // Creates:
    // 

    angular
        .module('PelisEOI')
        .component('movieCard', {
            templateUrl: '/components/movieCard/movieCard.html',
            controller: movieCardController,
            controllerAs: 'movieCard',
            bindings: {
                movie: '<',
            },
        });

    movieCardController.$inject = ['MoviesProvider'];
    function movieCardController(MoviesProvider) {
        var movieCard = this;
        //////////////////////////////// MAIN FUNTIONS ////////////////////////////////

        movieCard.$onInit = function () { };
        movieCard.$onChanges = function (changesObj) { };
        movieCard.$onDestroy = function () { };

        //////////////////////////////// AUX FUNTIONS /////////////////////////////////
    }
})();