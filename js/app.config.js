(function () {
    'use strict';

    angular.module('PelisEOI', ['ngRoute','rzModule','ui.bootstrap'])
        .config(config);

    config.$inject = ['$routeProvider'];
    function config($routeProvider) {
        $routeProvider
            .when("/",{
                controller: 'HomeController',
                templateUrl: '/movieManager/views/home.html',
                controllerAs: 'homeCtrl'
            })
            .when("/singup",{
                controller: 'singUpController',
                templateUrl: '/movieManager/views/singUp.html',
                controllerAs: 'singUpCtrl'
            });
    }
})();