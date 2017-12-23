(function () {
    'use strict';

    angular
        .module('PelisEOI')
        .factory('firebaseProvider', firebaseProvider);

    firebaseProvider.$inject = [];
    function firebaseProvider() {
        /* __________________________: Functions Declaration :_________________________ */
        var service = {
            registerNewUser: registerNewUser,
            registerNewUserByGoogle:registerNewUserByGoogle,
            registerNewUserByFacebook:registerNewUserByFacebook,
            singInUser: singInUser,
            singOutUser: singOutUser,
            updateUser: updateUser,
            loadUser:loadUser,
            getUser: getUser
        };

        return service;

        //////////////////////////////// MAIN FUNTIONS ////////////////////////////////

        function registerNewUser(user) {
            return firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
                .then(response => addDataUser(response, user))
                .catch(onError);
        }

        function registerNewUserByGoogle(){
            var provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithPopup(provider).then(function(result) {
                // This gives you a Google Access Token. You can use it to access the Google API.
                var token = result.credential.accessToken;
                // The signed-in user info.
                var user = result.user;
                sendEmailVerification();
                // ...
              }).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
                // ...
              });
        }

        function registerNewUserByFacebook(){
            var provider = new firebase.auth.FacebookAuthProvider();
            console.log('Estamos in');
            firebase.auth().signInWithPopup(provider).then(function(result) {
                // This gives you a Google Access Token. You can use it to access the Google API.
                var token = result.credential.accessToken;
                // The signed-in user info.
                var user = result.user;
                
                // ...
              }).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
                // ...
              });
        }
        
        function sendEmailVerification(){
            var actionCodeSettings = {
                url: 'https://peliseoi-675a0.firebaseapp.com/?email=' + firebase.auth().currentUser.email,
                iOS: {
                  bundleId: 'com.example.ios'
                },
                android: {
                  packageName: 'com.example.android',
                  installApp: true,
                  minimumVersion: '12'
                },
                handleCodeInApp: true
              };
            firebase.auth().currentUser.sendEmailVerification(actionCodeSettings)
            .then(function() {
              console.log('Enviado');
            })
            .catch(onError);
        }

        function singInUser(user) {
            return firebase.auth().signInWithEmailAndPassword(user.email, user.password)
                .catch(onError);
        }

        function singOutUser(user) {
            firebase.auth().signOut().then(function() {
                console.log('Se salio con exito bróh!')
              }).catch(onError);
        }

        function updateUser(user) {
            if(!user.favMovies) user.favMovies = [];
            if(!user.viewMovies) user.viewMovies = [];
            if(!user.moviesToWatch) user.moviesToWatch = [];

            firebase.database().ref('/users/' + user.uid).update({
                favMovies: user.favMovies,
                viewMovies: user.viewMovies,
                moviesToWatch: user.moviesToWatch
            });
        }

        function loadUser() {
            var userId = firebase.auth().currentUser.uid;
            console.log(userId)
            return firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
              var username = snapshot.val() || 'Anonymous';
              return username;
            });
        }

        function getUser(userId) {
            return promise = new Promise(function (resolve, reject) {
                firebase.database().ref('/users/' + userId).on('value', data => {
                    resolve(data.val());
                });
            });
        }
        ////////////////////////////// SECUNDARY FUNTIONS /////////////////////////////
        function onError(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(error);
        }

        function addDataUser(response, user) {
            let uid = response.uid;
            firebase.database().ref('/users/' + uid).set({
                name: user.name,
                email: user.email,
                birth: 'user.birth',
                // favMovies: user.favMovies,
                // viewMovies: user.viewMovies,
                // moviesToWatch: user.moviesToWatch
            });
            // console.log(user)
            return singInUser(user);
        }
    }
})();