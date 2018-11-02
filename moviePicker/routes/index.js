var express = require('express');
var router = express.Router();
var request = require("request");

var keys = [];
var movieDisplay = [];

/* GET home page. */
router.get('/', function(req, res, next) {
    res.sendFile('movies.html', { root: 'public' });
    console.log("in /")
    var userkey=req.query['k'];
    if (keys.indexOf(userkey)!=-1){
        console.log("keys:"+keys);
        var index=keys.indexOf(userkey);
        var jsonResult = movieDisplay[index];
        console.log("sending:"+jsonResult);
        res.status(200).json(jsonResult);
    }
});

var movieQueue = [];
var allmovies=[];
var pagecount = [];
var imageurl = "https://image.tmdb.org/t/p/w500";
router.get('/checkKey', function(req, res, next) {
    var jsonResult;
    var movielist=[];
    var userkey = req.query['k'];
    console.log("Keys:"+ keys+" userkey:"+userkey);
    if (keys.indexOf(userkey) != -1) {
        console.log("found")
        var index=keys.indexOf(userkey)
        jsonResult = movieDisplay[index];
        console.log("sending:"+jsonResult)
        return res.status(200).json(jsonResult);
    }
    else {
        console.log("creating new")
        keys.push(userkey);
        console.log("new keys:"+keys);
        
        /*var options = { method: 'GET',
            url: 'https://api.themoviedb.org/3/discover/movie',
            qs: 
            { page: '1',
             sort_by: 'popularity.desc',
             api_key: '7678944848f7b822b6b11c2978c94dea' },
            body: '{}' };*/
        var url="https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=7678944848f7b822b6b11c2978c94dea"
        console.log("url"+url)
        request(url, function(err, resp, body) {
            if (err) res.status(300)
            console.log("recieved new data");
            var moviestoqueue=[];
            var response = JSON.parse(body);
            for (x in response["results"]){
                var imgposter = imageurl + response["results"][x]["poster_path"]
                var imgbkgrnd = imageurl + response["results"][x]["backdrop_path"]
                if (x < 12) {
                    movielist.push({
                        title: response["results"][x]["title"],
                        about: response["results"][x]["overview"],
                        upvotes: 0,
                        nameimage: imgposter,
                        backgrdimage: imgbkgrnd,
                        vote: response["results"][x]["vote_average"]
                    });
                }
                else {
                    moviestoqueue.push({
                        title: response["results"][x]["title"],
                        about: response["results"][x]["overview"],
                        upvotes: 0,
                        nameimage: imgposter,
                        backgrdimage: imgbkgrnd,
                        vote: response["results"][x]["vote_average"]
                    });
                }
            }
        
            movieDisplay.push(movielist);
            movieQueue.push(moviestoqueue);
            for (i in movielist) allmovies.push(movielist[i]);
            for (i in moviestoqueue) allmovies.push(moviestoqueue[i])
            console.log("movieDisplay:"+movieDisplay)
            pagecount.push(1);
        });
    }
    index=keys.indexOf(userkey);
        jsonResult = movieDisplay[index];
        console.log("sending:"+jsonResult);
        console.log("could send:"+movielist)
        return res.status(200).json(jsonResult);
});
router.get("/like", function(req, res, next) {
    var userkey = req.query['k'];
    var moviename = req.query['n'];
    var index = keys.indexOf(userkey);
    for (i in movieDisplay[index]) {
        if (movieDisplay[index][i]["title"] == moviename) {
            movieDisplay[index][i]["upvotes"]++;
        }
    }
    res.status(200).json(movieDisplay[index]);
});
router.get("/delete", function(req, res, next) {
    console.log("deleting")
    var userkey = req.query['k'];
    var moviename = req.query['n'];
    console.log("key:"+userkey+" name:"+moviename+" array:"+movieDisplay)
    var index = keys.indexOf(userkey);
    console.log("keys:"+keys+" index:"+index)
    for (i in movieDisplay[index]) {
        if (movieDisplay[index][i]["title"] == moviename) {
            movieDisplay[index][i] = movieQueue[index][0];
            console.log(movieDisplay[index][i]["title"]);
            movieQueue[index].splice(0, 1);
        }
    }
    if (movieQueue[index].length < 3) {
        var options = { method: 'GET',
            url: 'https://api.themoviedb.org/3/discover/movie',
            qs: 
            { page: ++pagecount[index],
             include_video: 'false',
             include_adult: 'false',
             sort_by: 'popularity.desc',
             language: 'en-US',
             api_key: '7678944848f7b822b6b11c2978c94dea' },
            body: '{}' };
        request(options, function(err, res, body) {
            var response = JSON.parse(body);
            for (x in response["results"]){
                console.log("title:"+response["results"][x].title)
                var imgposter = imageurl + response["results"][x]["poster_path"]
                var imgbkgrnd = imageurl + response["results"][x]["backdrop_path"]
                movieQueue[index].push({
                    title: response["results"][x]["title"],
                    about: response["results"][x]["overview"],
                    upvotes: 0,
                    nameimage: imgposter,
                    backgrdimage: imgbkgrnd,
                    vote: response["results"][x]["vote_average"]
                });
            }
        })
    }
    res.status(200).json(movieDisplay[index]);
});
router.get('/find', function(req, res, next) {
    var moviename = req.query['n'];
    //var url = "https://api.themoviedb.org/3/search/movie?api_key=7678944848f7b822b6b11c2978c94dea&query=" + moviename;
    var searchmovies = [];
    var options = { method: 'GET',
            url: 'https://api.themoviedb.org/3/search/movie',
            qs: 
            { query:moviename,
             api_key: '7678944848f7b822b6b11c2978c94dea' },
            body: '{}' };
    request(options, function(err, res, body) {
        var response = JSON.parse(body);
        for (x in response["results"]) {
            if (response["results"][x]["popularity"] > 3) {
                var imgposter = imageurl + response["results"][x]["poster_path"]
                var imgbkgrnd = imageurl + response["results"][x]["backdrop_path"]
                searchmovies.push({
                    title: response["results"][x]["title"],
                    about: response["results"][x]["overview"],
                    upvotes: 0,
                    nameimage: imgposter,
                    backgrdimage: imgbkgrnd,
                    vote: response["results"][x]["vote_average"],
                    id: response["results"][x]["id"]
                });
            }
        }
    });
    res.status(200).json(searchmovies);
})
router.get('/addMovie', function(req, res, next) {
    var userkey = req.query['k'];
    var movieId = req.query['id'];
    var index = keys.indexOf(userkey);
    var movie=[]
    var url="https://api.themoviedb.org/3/movie/"+movieId+"?api_key=7678944848f7b822b6b11c2978c94dea";
    request.get(url, function(err, res, body) {
        var response = JSON.parse(body);
        var imgposter = imageurl + response["data"]["poster_path"];
        var imgbkgrnd = imageurl + response["data"]["backdrop_path"];
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
    while(true){
        for (var i = movieDisplay[index].length - 1; i >= 0; --i) {
            if(movieDisplay[index][i].upvotes<movie[0].upvotes){
                movieQueue.splice(0,0,movieDisplay[index][i]);
                movieDisplay[index][i]=movie[0];
                return res.status(200).json(movieDisplay[index]);
            }
        }
        movie[0].upvotes++;
    }
});
module.exports = router;
