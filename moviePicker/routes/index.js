var express = require('express');
var router = express.Router();

var movieNights = [];

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log("sending main");
    res.sendFile('movies.html', { root: 'public' });
});

router.get('/join', function(req, res, next) {
    var movieNight = req.query["q"];
    if (movieNights.indexOf(movieNight) > 0) {
        // do something
    }
})

router.post('/create', function(req, res) {
    console.log("In Create Session");
    console.log(req.body);
    movieNights.push(req.body.session);
    console.log("Movie Nights:" + movieNights.toString());
    res.send('{"success" : "Updated Successfully", "status" : 200}');
});

module.exports = router;
