var path = require('path');
var util = require('util');
var express = require('express');
var router = express.Router();
var db = require(path.join(global.appRoot, 'model'));

router.get('/getZipCodes', function (req, res, next) {
    db.zipCodes.find().toArray(function (err, items) {

        res.json(items);
    })
});

router.get('/getStates', function (req, res, next) {
    db.zipCodes.aggregate([
        { '$group': { '_id': { state: '$state' } } },
        { '$sort': { '_id.state': 1 } },
        { '$project': { state: '$_id.state', '_id': 0 } }
    ], function (err, items) {
        res.json(items);
    })
});

router.get('/getCitiesFromStates/:state', function (req, res, next) {

    let stateVal = req.params.state;
    console.log(stateVal);
    db.zipCodes.aggregate([
        { '$match': { state: stateVal } },
        { '$group': { '_id': { city: '$city' } } },
        { '$sort': { '_id.city': 1 } },
        { '$project': { city: '$_id.city', '_id': 0 } }
    ], function (err, items) {

        res.json(items);
    })
});


router.get('/getCitiesFromState/:zipCode', function (req, res, next) {

    var zipCode = req.params.zipCode;

    db.zipCodes.find({ '_id': zipCode }).toArray(function (err, items) {
        res.json(items);
    })
});

router.get('/getItemsFromCities/:state/:city', function (req, res, next) {
    var state = req.params.state;
    var city = req.params.city;
    console.log(city);
    db.items.find({ $and: [{ 'city': city }, { 'state': state }] }).toArray(function (err, items) {
        res.json(items);
    })
})

router.post('/saveItems', function (req, res, next) {

    // if (!req.body.location) {
    //     req.body.location = {
           
    //         coordinates: [-91.96662, 41.02267]
    //     }
    // }

  //  req.body.imgPath = "abc";
    console.log(req.body);

    var itemsData = {
        itemName: req.body.itemName,
        shortDescription: req.body.shortDescription,
        itemDetails: req.body.itemDetails,
        contactInformation: req.body.contactInformation,
        category: req.body.category,
        state: req.body.state,
        city: req.body.city,
        "location": {
            "type": "Point",
            "coordinates":  [-91.96662, 41.02267]//[parseFloat(req.body.location.coordinates[0]), parseFloat(req.body.location.coordinates[0])]
        },
        imgPath: "abc"
    }

    router.get('/search', function (req, res, next) {

    })

    db.items.insert(itemsData, function (err, docInserted) {
        if (err) throw err;
        console.dir(`Success: $(JSON.stringify(docInserted))`);

        res.send('done');

    })
})

router.get('/getItemsNearMe', function (req, res, next) {
    var latitude = req.query.latitude;
    var longitude = req.query.longitude;

    console.log(req.query);

    var query = {
        'location': {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [
                        parseFloat(longitude),
                        parseFloat(latitude)
                    ]
                }, $maxDistance: 20000
            }
        }
    }

    console.log(JSON.stringify(query));
    db.items.find(query).toArray(function (err, items) {
        console.log(arguments);
        res.json(items);
    })
})

router.get('/searchItems', function (req, res, next) {
    var itemName = req.query.itemName;
    var city = req.query.city;
    var category = req.query.category;


    console.log(req.query);


    db.items.find(

        {
            $and:
            [
                { "itemName": { '$regex': itemName } },
                { "city": { '$regex': city } },
                { "category": { '$regex': category } }

            ]
        }

    ).toArray(function (err, items) {
        if (err) throw err;
        console.log(arguments);
        res.json(items);
    })
})

module.exports = router;

