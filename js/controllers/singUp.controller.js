(function () {
    'use strict';

    angular
        .module('PelisEOI')
        .controller('singUpController', singUpController);

    singUpController.$inject = ['firebaseProvider'];
    function singUpController(FBP) {
        /* __________________________: Variables Declaration :_________________________ */
        var vm = this;
        vm.newUser = {};

        /* __________________________: Functions Declaration :_________________________ */
        vm.registerNewUser = registerNewUser;
        vm.registerNewUserByGoogle = registerNewUserByGoogle;
        vm.registerNewUserByFacebook = registerNewUserByFacebook;

        activate();

        //////////////////////////////// MAIN FUNTIONS ////////////////////////////////

        function activate() { }

        function registerNewUser() {
            if (vm.newUser.repeatPassword !== vm.newUser.password) {
                console.log("Error Contraseña");
                return;
            }

            FBP.registerNewUser(vm.newUser).then(function(response){
                console.log(response);
                history.back();

            });
            
        }

        function registerNewUserByGoogle(){
            FBP.registerNewUserByGoogle()
        }

        function registerNewUserByFacebook(){
            FBP.registerNewUserByFacebook()
        }
    }
})();