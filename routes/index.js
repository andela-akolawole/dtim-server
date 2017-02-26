var express = require('express');
var router = express.Router();
var Testimony = require('../db/schemas/testimony');
/* GET home page. */
router.get('/', function (req, res) {
  res.render('index', { title: 'Express' });
});

// Get testimony page 
router.get('/testimony', function (req, res) {
  Testimony.find({}, function (err, result) {
    if (!err) {
      var approved = result.filter((value) => {
        if (value.status === 'approved') {
          return value;
        }
      });
      var pending = result.filter((value) => {
        if (value.status === 'pending') {
          return value;
        }
      });

      res.render('testimony', {
        approved: approved,
        pending: pending
      });
    } else {
      res.status('500').json({
        status: 'error',
        message: 'There is an error',
        error: err
      });
    }
  });
});

router.get('/testimony/:id', function (req, res) {
    Testimony.findById(req.params.id, function (err, result) {
        if (!err) {
            var status;
            if (result.status === 'pending') {
              status = false;
            }
            if (result.status === 'approved') {
              status = true;
            }
            res.render('testimonyView', {
              result: result,
              status: status
            });
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
