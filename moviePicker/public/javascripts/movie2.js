var apiKey = "7678944848f7b822b6b11c2978c94dea";
var imageurl = "https://image.tmdb.org/t/p/w500";
var movieurl = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=";
var pagenum = 1;
var infotext = "IT'S MOVIE NIGHT, and you haven't yet decided on a movie, instead of randomly listing off movie names that you have already watch, let us help. Press start and we will give you a list of all movies based on popularity from there, if you decide you like it, you can press the thumbs up if you want to move it's position closer to the top, the 'x' to have it removed from the list, or the movie picture to view a description and other facts. At any time, you can press the start button to start the process over again. Enjoy!"
var app = angular.module('app', ['ui.router']);
var sessionkey;

app.config(function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist(['**']);
});

app.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        console.log("State provider");
        $stateProvider
            .state('main', {
                url: '/main',
                templateUrl: '/main.html',
                controller: 'MainCtrl'
            })
            .state('movie', {
                url: '/movie',
                templateUrl: '/movie.html',
                controller: 'MovieCtrl'
            });

        $urlRouterProvider.otherwise('main');
    }
]);

app.factory("movieFactory", [function($http) {

    var o = {
        movies: [],
        moviestoqueue: [],
        moviepopup: [],
        session: ""
    };
    return o;
}]);

app.controller('MainCtrl',
    function($scope, $http, movieFactory) {
        console.log("Main Controller");
        $scope.info = infotext;
        $scope.moviequeue=movieFactory.movies;
        $scope.moviepopup=movieFactory.moviepopup;
        
        $scope.startSession = function() {
            console.log($scope.sessionName);
            sessionkey = $scope.sessionName;
            var url = '/checkKey?k=' + sessionkey;
            console.log(url);
            $http.get(url).then(function(response) {
                console.log(response)
                $scope.moviequeue = response["data"];
            });
            if ($scope.moviequeue.length < 10) {
                $http.get(url).then(function(response) {
                console.log(response)
                $scope.moviequeue=response["data"];
                });
            }
            if($scope.moviequeue.length<10){
                $http.get(url).then(function(response) {
                console.log(response)
                $scope.moviequeue=response["data"];
                });
            }
            $scope.sessionName = "";
            $scope.info = "";
        };

        $scope.check = function() {
            console.log("checking")
            console.log($scope.moviequeue)

        };
    }
);

app.controller('MovieCtrl',
    function($scope, $http, movieFactory) {
        console.log("Movie state");

        $scope.movieQueue = movieFactory.movies;
        $scope.moviepopup=movieFactory.moviepopup;
        // console.log(movieFactory.session);
        // $scope.moviequeue = movieFactory.movies;
        // $scope.movieToqueue = movieFactory.moviestoqueue;
        // $scope.moviepopup = movieFactory.moviepopup;
        // console.log($scope.moviequeue);

        $scope.refresh = function() {
            var url = '/checkKey?k=' + movieFactory.session;
            $http.get(url).then(function(response) {
                // console.log("Server Response");
                $scope.movieQueue = response.data;
                console.log("queue:" + $scope.movieQueue);
            });
            $scope.test = "MASON";
        };

        $scope.init = function() {
            $scope.refresh();
        };

        $scope.popup = function(movie) {
            console.log("in pop up")
            console.log(movie)
            $scope.moviepopup.push({
                movie
            })
        };

        $scope.popdown = function() {
            $scope.moviepopup.splice(0, 1)
        };

        $scope.incrementUpvotes = function(movie) {
            var url = '/like?k=' + sessionkey+"&n="+movie.title;
            $http.get(url).then(function(response) {
                console.log(response)
                $scope.moviequeue=response["data"];
            });
        };

        $scope.deleteMovie = function(movie) {
            var url = '/delete?k=' + sessionkey+"&n="+movie.title;
            $http.get(url).then(function(response) {
                console.log(response)
                $scope.moviequeue=response["data"];
            });
        };
    });

app.directive('avatar', avatarDirective);

function avatarDirective() {
    return {
        scope: {
            movies: '='
        },
        restrict: 'E',
        replace: 'true',
        template: (
            '<div class ="Avatar">' +
            '<img ng-src="{{movies.nameimage}}"/>' +
            '<span id="adder" ng-click="incrementUpvotes(movie)">$ </span>' +
            '<span id="deleter" ng-click="deleteMovie(movie)"> X</span>' +
            '</div>'
        )
    }
}
