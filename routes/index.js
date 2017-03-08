var express = require('express');
var router = express.Router();
var Testimony = require('../db/schemas/testimony');
var Gallery = require('../db/schemas/gallery');
var cloudinary = require('cloudinary');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

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

router.get('/gallery', function (req, res) {
  return Gallery.find({}, null , {sort: {createdAt: -1}}, function (err, result) {
    console.log(result);
    if (result.length <= 0) {
      return res.render('gallery', {
        noImages: true
      });
    }
    if (result.length >= 1) {
      return res.render('gallery', {
        images: result,
        noImages: false
      });
    }
  })
});

router.post('/gallery/upload_success', function (req, res) {
  console.log(req.files.imageUploaded.path);
  cloudinary.uploader.upload_stream((result) => {
    if (result) {
      Gallery.create({
        url: result.url,
        name: req.files.imageUploaded.name,
        createdAt: new Date
      }, function (err, res) {});
    }
  }).end(req.files.imageUploaded.data);
  res.render('gallery', {
    uploadSuccess: true
  });
});

module.exports = router;
