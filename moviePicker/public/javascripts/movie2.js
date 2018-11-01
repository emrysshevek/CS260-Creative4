var apiKey = "7678944848f7b822b6b11c2978c94dea";
var imageurl = "https://image.tmdb.org/t/p/w500";
var movieurl = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=";
var pagenum = 1;
var infotext = "IT'S MOVIE NIGHT, and you haven't yet decided on a movie, instead of randomly listing off movie names that you have already watch, let us help. Press start and we will give you a list of all movies based on popularity from there, if you decide you like it, you can press the thumbs up if you want to move it's position closer to the top, the 'x' to have it removed from the list, or the movie picture to view a description and other facts. At any time, you can press the start button to start the process over again. Enjoy!"
var app = angular.module('app', ['ui.router']);

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

app.factory("movieFactory", [function() {
    var o = {
        movies: [],
        moviestoqueue: [],
        moviepopup: []
    };
    return o;
}]);

app.controller('MainCtrl',
    function($scope, $http, movieFactory) {
        console.log("Main Controller");
        $scope.info = infotext;

        $scope.createSession = function() {
            $scope.session = "Mason's Movie Night";
            var formData = { session: $scope.session };
            console.log(formData);
            var url = '/create';
            $http({
                url: url,
                method: "POST",
                data: formData
            }).then(function(response) {
                console.log(response);
            });
        };

        $scope.check = function() {
            console.log("checking")
            console.log($scope.moviequeue)
            console.log($scope.movieToqueue)
            console.log($scope.moviepopup)
        };
    }
);

app.controller('MovieCtrl',
    function($scope, $http, movieFactory) {
        console.log("Movie state");
        $scope.moviequeue = movieFactory.movies;
        $scope.movieToqueue = movieFactory.moviestoqueue;
        $scope.moviepopup = movieFactory.moviepopup;
        console.log($scope.moviequeue);

        $scope.init = function() {
            console.log("init");
            $scope.info = ""
            $scope.moviequeue = [];
            $scope.movieToqueue = [];
            var url = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=7678944848f7b822b6b11c2978c94dea";
            $http.get(url).then(function(response) {
                for (x in response["data"]["results"]) {
                    var imgposter = imageurl + response["data"]["results"][x]["poster_path"]
                    var imgbkgrnd = imageurl + response["data"]["results"][x]["backdrop_path"]
                    if (x < 12) {
                        $scope.moviequeue.push({
                            title: response["data"]["results"][x]["title"],
                            about: response["data"]["results"][x]["overview"],
                            upvotes: 0,
                            nameimage: imgposter,
                            backgrdimage: imgbkgrnd,
                            vote: response["data"]["results"][x]["vote_average"]
                        });
                    }
                    else {
                        $scope.movieToqueue.push({
                            title: response["data"]["results"][x]["title"],
                            about: response["data"]["results"][x]["overview"],
                            upvotes: 0,
                            nameimage: imgposter,
                            backgrdimage: imgbkgrnd,
                            vote: response["data"]["results"][x]["vote_average"]
                        });
                    }
                }
            });
            console.log($scope.moviequeue);
            $("#info").html = "";
        };

        $scope.popup = function(movie) {
            console.log("in pop up")
            console.log(movie)
            $scope.moviepopup.push({
                movie,
                id: "hello"
            })
        };

        $scope.popdown = function() {
            $scope.moviepopup.splice(0, 1)
        };

        $scope.incrementUpvotes = function(movie) {
            movie.upvotes++;
        };

        $scope.deleteMovie = function(movie) {
            movie.upvotes = 0;
            movie.title = $scope.movieToqueue[0].title;
            movie.about = $scope.movieToqueue[0].about;
            movie.nameimage = $scope.movieToqueue[0].nameimage;
            movie.backgrdimage = $scope.movieToqueue[0].backgrdimage;
            movie.vote = $scope.movieToqueue[0].vote;
            $scope.movieToqueue.splice(0, 1);
            if ($scope.movieToqueue.length < 3) {
                pagenum++;
                var url = movieurl + apiKey + "&page=" + pagenum;
                $http.get(url).then(function(response) {
                    console.log(response);
                    for (x in response["data"]["results"]) {
                        var imgposter = imageurl + response["data"]["results"][x]["poster_path"]
                        var imgbkgrnd = imageurl + response["data"]["results"][x]["backdrop_path"]
                        $scope.movieToqueue.push({
                            title: response["data"]["results"][x]["title"],
                            about: response["data"]["results"][x]["overview"],
                            nameimage: imgposter,
                            backgrdimage: imgbkgrnd,
                            upvotes: 0,
                            vote: response["data"]["results"][x]["vote_average"]
                        });
                    }
                });
            }
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
