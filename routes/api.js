var express = require('express');
var router = express.Router();
var Testimony = require('../db/schemas/testimony');

/* GET testimony listing. */
router.post('/testimony/submit', function(req, res) {
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
    Testimony.find({ status: 'approved' }).sort({createdAt: -1}).exec(function (err, result) {
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
})

module.exports = router;
