var express = require('express');
var router = express.Router();
var Testimony = require('../db/schemas/testimony');
var Gallery = require('../db/schemas/gallery');
var PastorPost = require('../db/schemas/pastorPost');
var PastorPicture = require('../db/schemas/pastorPicture');
var Ebook = require('../db/schemas/ebook');
var DailyDevotion = require('../db/schemas/dailyDevotion');
var cloudinary = require('cloudinary');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

/* GET home page. */
router.get('/', function (req, res) {
  return PastorPicture.find({}).exec(function (err, result) {

    if (result.length >= 1) {
      return res.render('index', { pastorPic: result[0] });
    }
    return res.render('index', { noPic: true });
  });
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
  return Gallery.find({}, null, { sort: { createdAt: -1 } }, function (err, result) {
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
  console.log(req.files.imageUploaded, "result");
  cloudinary.uploader.upload_stream((result) => {
    console.log(result, "result");
    if (result) {
      Gallery.create({
        url: result.url,
        name: req.files.imageUploaded.name,
        createdAt: new Date
      }, function (err, res) { });
    }
  }).end(req.files.imageUploaded.data);
  res.render('gallery', {
    uploadSuccess: true
  });
});

router.get('/pastor-post', function (req, res) {
  return PastorPost.find({})
    .sort({ createdAt: -1 })
    .exec(function (err, result) {
      if (result.length <= 0) {
        console.log('got here');
        return res.render('pastorPost', {
          posts: []
        });
      }
      return res.render('pastorPost', {
        posts: result
      });
    });
});

router.get('/pastor-post/:id/view', function (req, res) {
  return PastorPost.findById(req.params.id)
    .exec(function (err, result) {
      return res.render('pastorPostView', {
        post: result
      });
    });
});

router.get('/pastor-post/add', function (req, res) {
  return res.render('pastorPostAdd');
});

router.post('/pastor-post/save', function (req, res) {
  cloudinary.uploader.upload_stream((result) => {
    if (result) {
      req.body.imageUrl = result.url;
      return PastorPost.create(req.body, function (err, result) {
      });
    }
  }).end(req.files.imageUploaded.data);
  return res.redirect('/pastor-post');
});

router.post('/pastor-post/:id/update', function (req, res) {
  if (req.files.imageUploaded) {
    cloudinary.uploader.upload_stream((result) => {
      if (result) {
        req.body.imageUrl = result.url;
        return PastorPost.findByIdAndUpdate(req.params.id, { $set: req.body })
          .exec(function (err, result) {
          });
      }
    }).end(req.files.imageUploaded.data);
    return res.redirect('/pastor-post');
  }
  PastorPost.findByIdAndUpdate(req.params.id, { $set: req.body })
    .exec(function (err, result) {
    });
  return res.redirect('/pastor-post');
});

router.get('/pastor-post/:id/delete', function (req, res) {
  return PastorPost.findByIdAndRemove(req.params.id)
    .exec(function (err, result) {
      return res.redirect('/pastor-post');
    });
});

router.post('/pastor-picture/add', function (req, res) {
  cloudinary.uploader.upload_stream((result) => {
    if (result) {
      req.body.url = result.url;
      return PastorPicture.create(req.body, function (err, res) { })
    }
  }).end(req.files.imageUploaded.data);
  return res.redirect('/');
});

router.post('/pastor-picture/:id/update', function (req, res) {
  cloudinary.uploader.upload_stream((result) => {
    if (result) {
      req.body.url = result.url;
      return PastorPicture.findByIdAndUpdate(req.params.id, { $set: req.body }, function (err, res) { })
    }
  }).end(req.files.imageUploaded.data);
  res.redirect('/');
});

router.get('/daily-devotion', function (req, res) {
  return DailyDevotion.find({})
    .sort({ createdAt: -1 })
    .exec(function (err, result) {
      if (result.length <= 0) {
        console.log('got here');
        return res.render('dailyDevotion', {
          posts: []
        });
      }
      return res.render('dailyDevotion', {
        posts: result
      });
    });
});

router.get('/daily-devotion/add', function (req, res) {
  res.render('dailyDevotionAdd');
})

router.post('/daily-devotion/save', function (req, res) {
  cloudinary.uploader.upload_stream((result) => {
    if (result) {
      req.body.imageUrl = result.url;
      return DailyDevotion.create(req.body, function (err, res) { })
    }
  }).end(req.files.imageUploaded.data);
  return res.redirect('/');
});

router.get('/daily-devotion/:id/view', function (req, res) {
  return DailyDevotion.findById(req.params.id)
    .exec(function (err, result) {
      return res.render('dailyDevotionView', {
        post: result
      });
    });
});

router.post('/daily-devotion/:id/update', function (req, res) {
  if (req.files.imageUploaded) {
    cloudinary.uploader.upload_stream((result) => {
      if (result) {
        req.body.imageUrl = result.url;
        return DailyDevotion.findByIdAndUpdate(req.params.id, { $set: req.body })
          .exec(function (err, result) {
          });
      }
    }).end(req.files.imageUploaded.data);
    return res.redirect('/daily-devotion');
  }
  DailyDevotion.findByIdAndUpdate(req.params.id, { $set: req.body })
    .exec(function (err, result) {
    });
  return res.redirect('/daily-devotion');
});

router.get('/daily-devotion/:id/delete', function (req, res) {
  return DailyDevotion.findByIdAndRemove(req.params.id)
    .exec(function (err, result) {
      return res.redirect('/pastor-post');
    });
});

router.get('/ebook', function (req, res) {
  return Ebook.find()
    .sort({ createdAt: -1 })
    .exec(function (err, result) {
      if (result.length <= 0) {
        return res.render('ebook', {
          books: []
        });
      }
      return res.render('ebook', {
        books: result
      });
    });
});

router.get('/ebook/add', function (req, res) {
  return res.render('ebookAdd');
});

router.post('/ebook/add', function (req, res) {
  cloudinary.uploader.upload_stream((result) => {
    if (result) {
      req.body.bookCover = result.url;
      return Ebook.create(req.body, function (err, res) { })
    }
  }).end(req.files.bookCover.data);
  return res.redirect('/');
});

router.get('/ebook/:id/view', function (req, res) {
  return Ebook.findById(req.params.id)
    .exec(function (err, result) {
      if (result) {
        res.render('ebookView', {
          book: result
        });
      }
    })
});

router.post('/ebook/:id/update', function (req, res) {
  if (req.files.bookCover) {
    cloudinary.uploader.upload_stream((result) => {
      if (result) {
        req.body.bookCover = result.url;
        return Ebook.findByIdAndUpdate(req.params.id, { $set: req.body })
          .exec(function (err, result) {
          });
      }
    }).end(req.files.bookCover.data);
    return res.redirect('/ebook');
  }
  Ebook.findByIdAndUpdate(req.params.id, { $set: req.body })
    .exec(function (err, result) {
    });
  return res.redirect('/ebook');
});

router.get('/ebook/:id/delete', function (req, res) {
  return Ebook.findByIdAndRemove(req.params.id)
    .exec(function (err, result) {
      return res.redirect('/ebook');
    });
})



module.exports = router;
