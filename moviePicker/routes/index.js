var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('index.html', { root: 'public' });
});
var keys=[];
var movieDisplay=[];
var movieQueue=[];
router.get('/checkKey', function(req,res,next){
    var jsonResult;
    var userkey=req.query['k'];
    for(key in keys){
        if(key===userkey){
            jsonResult=movieDisplay[key];
            res.status(200).json(jsonResult);
        }
    }
    
})
module.exports = router;
