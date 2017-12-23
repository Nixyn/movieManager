(function () {
    'use strict';

    angular.module('PelisEOI', ['ngRoute','rzModule','ui.bootstrap'])
        .config(config);

    config.$inject = ['$routeProvider'];
    function config($routeProvider) {
        $routeProvider
            .when("/",{
                controller: 'HomeController',
                templateUrl: '/views/home.html',
                controllerAs: 'homeCtrl'
            })
            .when("/singup",{
                controller: 'singUpController',
                templateUrl: '/views/singUp.html',
                controllerAs: 'singUpCtrl'
            });
    }
})();