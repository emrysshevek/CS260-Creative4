var apiKey = "7678944848f7b822b6b11c2978c94dea";
var imageurl = "https://image.tmdb.org/t/p/w500";
var movieurl = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=";
var pagenum = 1;
var infotext = "IT'S MOVIE NIGHT, and you haven't yet decided on a movie, instead of randomly listing off movie names that you have already watch, let us help. Press start and we will give you a list of all movies based on popularity from there, if you decide you like it, you can press the thumbs up if you want to move it's position closer to the top, the 'x' to have it removed from the list, or the movie picture to view a description and other facts. At any time, you can press the start button to start the process over again. Enjoy!"
var app = angular.module('app', ['ui.router']);
var sessionkey=0;

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
        moviepopup: [],
        session: 0,
        searchmovies:[]
    };
    return o;
}]);

app.controller('MainCtrl',
    function($scope, $http, movieFactory) {
        console.log("Main Controller");
        $scope.info = infotext;
        $scope.moviequeue=movieFactory.movies;
        $scope.moviepopup=movieFactory.moviepopup;
        $scope.keyForSession=movieFactory.session;
        $scope.startSession = function() {
            console.log("sessionkey:" +sessionkey+", "+$scope.keyForSession)
            sessionkey = $scope.sessionName;
            $scope.keyForSession=$scope.sessionName;
            console.log("sessionkey:" +sessionkey+", "+$scope.keyForSession)
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
        $scope.searchmovies=movieFactory.searchmovies;
        $scope.movieQueue = movieFactory.movies;
        $scope.moviepopup=movieFactory.moviepopup;
        $scope.keyForSession=movieFactory.session;
        // console.log(movieFactory.session);
        // $scope.moviequeue = movieFactory.movies;
        // $scope.movieToqueue = movieFactory.moviestoqueue;
        // $scope.moviepopup = movieFactory.moviepopup;
        // console.log($scope.moviequeue);

        $scope.refresh = function() {
            console.log("sessionkey:" +sessionkey+", "+$scope.keyForSession)
            $scope.keyForSession=sessionkey;
            var url = '/checkKey?k=' + sessionkey;
            $http.get(url).then(function(response) {
                // console.log("Server Response");
                $scope.movieQueue = response.data;
                console.log("queue:" + $scope.movieQueue);
            });
            $scope.test = "MASON";
            if(!($scope.movieQueue[0])){
                $http.get(url).then(function(response) {
                    // console.log("Server Response");
                    $scope.movieQueue = response.data;
                    console.log("queue:" + $scope.movieQueue);
                });
                var start=new Date().getTime();
                var end=start+700;
                while (start<end){
                    start=new Date().getTime();
                }
                console.log("retry queue:"+$scope.movieQueue)
            }
        };

        $scope.init = function() {
            $scope.refresh();
        };

        $scope.popup = function(movie) {
            $scope.refresh()
            $scope.moviepopup.push({
                movie
            })
        };

        $scope.popdown = function() {
            $scope.refresh();
            $scope.moviepopup.splice(0, 1)
        };

        $scope.incrementUpvotes = function(movie) {
            var url = '/like?k=' + sessionkey+"&id="+movie.id;
            $http.get(url).then(function(response) {
                console.log(response)
                $scope.movieQueue=response["data"];
            });
        };

        $scope.deleteMovie = function(movie) {
            console.log("sessionkey:" +sessionkey+", "+$scope.keyForSession)
            var url = '/delete?k=' + sessionkey+"&id="+movie.id;
            $http.get(url).then(function(response) {
                console.log(response)
                $scope.movieQueue=response["data"];
            });
        };
        $scope.search=function(movie){
            var url='/find?n='+$scope.movieSearchName;
            console.log("searching:"+$scope.movieSearchName)
            $http.get(url).then(function(response){
                $scope.searchmovies=response.data;
            })
            console.log("search:"+$scope.searchmovies)
        }
        $scope.addMovie=function(movie){
            console.log("sessionkey:" +sessionkey+", "+$scope.keyForSession)
            var url='/addMovie?k='+sessionkey+"&id="+movie.id;
            $http.get(url).then(function(response) {
                console.log(response)
                $scope.movieQueue=response["data"];
            });
        }
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
