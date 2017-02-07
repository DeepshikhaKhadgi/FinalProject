var path=require('path');
var util = require('util');
var express=require('express');
var router = express.Router();
var db = require(path.join(global.appRoot,'model'));

router.get('/getZipCodes', function (req, res, next) {
  db.zipCodes.find().toArray(function (err, items) {
    
    res.json(items);
  })
});

router.get('/getZipCodes/getCities', function(req, res, next){
    db.zipCodes.find({'_id':'01001'}).toArray(function(err, items){
        res.json(items);
    })
});

module.exports = router;