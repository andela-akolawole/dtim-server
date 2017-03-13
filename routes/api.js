var express = require('express');
var moment = require('moment');
var objectAssign = require('object-assign');
var router = express.Router();
var Testimony = require('../db/schemas/testimony');
var DailyDevotion = require('../db/schemas/dailyDevotion');
var Gallery = require('../db/schemas/gallery');
var PastorPost = require('../db/schemas/pastorPost');

function formatDate(date) {
    var monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    ];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return day + ' ' + monthNames[monthIndex] + ' ' + year;
}

/* GET testimony listing. */
router.post('/testimony/submit', function (req, res) {
    var testimony = new Testimony({
        fullName: req.body.fullName,
        testimony: req.body.testimony,
        status: 'pending',
        gender: req.body.gender
    });
    testimony.save();
    res.status(201).send('Successfully created');
});

router.get('/testimony/all', function (req, res) {
    Testimony.find({}, function (err, result) {
        if (!err) {
            res.status(200).json(result);
        } else {
            res.status('500').json({
                status: 'error',
                message: 'There is an error',
                error: err
            });
        }
    });
})

router.get('/testimony/pending', function (req, res) {
    Testimony.find({ status: 'pending' }, function (err, result) {
        if (!err) {
            res.status(200).json(result);
        } else {
            res.status('500').json({
                status: 'error',
                message: 'There is an error',
                error: err
            });
        }
    });
})

router.get('/testimony/approved', function (req, res) {
    Testimony.find({ status: 'approved' }).sort({ createdAt: -1 }).exec(function (err, result) {
        if (!err) {
            res.status(200).json(result);
        } else {
            res.status('500').json({
                status: 'error',
                message: 'There is an error',
                error: err
            });
        }
    });
})

router.get('/testimony/:id', function (req, res) {
    Testimony.findById(req.params.id, function (err, result) {
        if (!err) {
            res.status(200).json(result);
        } else {
            res.status('500').json({
                status: 'error',
                message: 'There is an error',
                error: err
            });
        }
    });
});

router.post('/testimony/:id', function (req, res) {
    Testimony.findByIdAndUpdate(req.params.id, { $set: req.body }, function (err, result) {
        if (!err) {
            if (req.body.redirect === 'redirect') {
                return res.redirect('/testimony')
            }
            res.status(201).send('Updated')
        } else {
            res.status('500').json({
                status: 'error',
                message: 'There is an error',
                error: err
            });
        }
    });
})

router.get('/testimony/:id/delete', function (req, res) {
    Testimony.findByIdAndRemove(req.params.id, function (err, result) {
        if (!err) {
            console.log(req.query.redirect);
            if (req.query.redirect === 'redirect') {
                return res.redirect('/testimony')
            }
            res.status(201).send('Deleted')
        } else {
            res.status('500').json({
                status: 'error',
                message: 'There is an error',
                error: err
            });
        }
    });
});

router.get('/gallery/images/', function (req, res) {
    return Gallery.find({})
        .sort({ createdAt: -1 })
        .limit(Number(req.query.limit))
        .exec(function (err, result) {
            return res.status(200).json(result);
        });
});

router.get('/pastor-post/get', function (req, res) {
    return PastorPost.find({})
        .limit(Number(req.query.limit))
        .sort({createdAt: -1})
        .exec(function (err, result) {
            if (result) {
                // console.log(result, 'result')
                result = result.map(function (value) {
                    const myDate = moment(value.createdAt).format('Do MMMM YYYY');
                    const newObject = Object.assign({}, value.toObject(), { createdAt: myDate })
                    return newObject;
                });
                return res.json(result);
            };
        })
});

router.get('/daily-devotion/get', function (req, res) {
    return DailyDevotion.find({})
        .limit(Number(req.query.limit))
        .sort({createdAt: -1})
        .exec(function (err, result) {
            if (result) {
                // console.log(result, 'result')
                result = result.map(function (value) {
                    const myDate = moment(value.createdAt).format('Do MMMM YYYY');
                    const newObject = Object.assign({}, value.toObject(), { createdAt: myDate })
                    return newObject;
                });
                return res.json(result);
            };
        })
});
module.exports = router;
