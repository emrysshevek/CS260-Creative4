var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
    res.sendFile('movies.html', { root: 'public' });
});
var keys = [];
var movieDisplay = [];
var movieQueue = [];
var pagecount = [];
var imageurl = "https://image.tmdb.org/t/p/w500";
router.get('/checkKey', function(req, res, next) {
    var jsonResult;
    var userkey = req.query['k'];
    if (keys.indexOf(userkey) != -1) {
        jsonResult = movieDisplay[keys.indexOf(userkey)];
        res.status(200).json(jsonResult);
    }
    else {
        keys.push(userkey);
        var url = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=7678944848f7b822b6b11c2978c94dea";
        $.getJSON(url, function(response) {
            var movielist = [];
            var moviestoqueue = [];
            for (x in response["data"]["results"]) {
                var imgposter = imageurl + response["data"]["results"][x]["poster_path"]
                var imgbkgrnd = imageurl + response["data"]["results"][x]["backdrop_path"]
                if (x < 12) {
                    movielist.push({
                        title: response["data"]["results"][x]["title"],
                        about: response["data"]["results"][x]["overview"],
                        upvotes: 0,
                        nameimage: imgposter,
                        backgrdimage: imgbkgrnd,
                        vote: response["data"]["results"][x]["vote_average"]
                    });
                }
                else {
                    moviestoqueue.push({
                        title: response["data"]["results"][x]["title"],
                        about: response["data"]["results"][x]["overview"],
                        upvotes: 0,
                        nameimage: imgposter,
                        backgrdimage: imgbkgrnd,
                        vote: response["data"]["results"][x]["vote_average"]
                    });
                }
            }
            movieDisplay.push(movielist);
            movieQueue.push(moviestoqueue);
            for (i in movielist) allmovies.push(movielist[i]);
            for (i in moviestoqueue) allmovies.push(moviestoqueue[i])
            pagecount.push(1);
            res.status(200).json(movielist);
        });
    }
});
router.get("/like", function(req, res, next) {
    var userkey = req.jquery['k'];
    var moviename = req.jquery['n'];
    var index = keys.indexOf(userkey);
    for (i in movieDisplay[index]) {
        if (movieDisplay[index][i]["title"] == moviename) {
            movieDisplay[index][i]["upvotes"]++;
        }
    }
    res.status(200).json(movieDisplay[index]);
});
router.get("/delete", function(req, res, next) {
    var userkey = req.jquery['k'];
    var moviename = req.jquery['n'];
    var index = keys.indexOf(userkey);
    for (i in movieDisplay[index]) {
        if (movieDisplay[index][i]["title"] == moviename) {
            movieDisplay[index][i] = movieQueue[index][0];
            movieQueue[index].splice(0, 1);
        }
    }
    if (movieQueue[index].size() < 3) {

    }
    res.status(200).json(movieDisplay[index]);
});
router.get('/find', function(req, res, next) {
    var moviename = req.jquery['n'];
    var url = "https://api.themoviedb.org/3/search/movie?api_key=7678944848f7b822b6b11c2978c94dea&query=" + moviename;
    var searchmovies = [];
    $.getJSON(url, function(response) {
        for (x in response["data"]["results"]) {
            if (response["data"]["results"][x]["popularity"] > 3) {
                var imgposter = imageurl + response["data"]["results"][x]["poster_path"]
                var imgbkgrnd = imageurl + response["data"]["results"][x]["backdrop_path"]
                searchmovies.push({
                    title: response["data"]["results"][x]["title"],
                    about: response["data"]["results"][x]["overview"],
                    upvotes: 0,
                    nameimage: imgposter,
                    backgrdimage: imgbkgrnd,
                    vote: response["data"]["results"][x]["vote_average"],
                    id: response["data"]["results"][x]["id"]
                });
            }
        }
    });
    res.status(200).json(searchmovies);
})
router.get('/addMovie', function(req, res, next) {
    var userkey = req.jquery['k'];
    var movieId = req.jquery['id'];
    var index = keys.indexOf(userkey);
    var movie=[]
    var url="https://api.themoviedb.org/3/movie/"+movieId+"?api_key=7678944848f7b822b6b11c2978c94dea";
    $.getJSON(url, function(response) {
        var imgposter = imageurl + response["data"]["poster_path"]
        var imgbkgrnd = imageurl + response["data"]["backdrop_path"]
        movie.push({
            title: response["data"]["title"],
            about: response["data"]["overview"],
            upvotes: 2,
            nameimage: imgposter,
            backgrdimage: imgbkgrnd,
            vote: response["data"]["vote_average"],
            id: movieId
        });
    });
    for (var i = movieDisplay.length - 1; i >= 0; --i) {
        if
    }
})
module.exports = router;
