var express = require('express');
var router = express.Router();
const { asyncHandler } = require('./utils');
const {
  singleMulterUpload,
  singlePublicFileUpload,
} = require('../awsS3');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Good Seeds' });
});

router.get('/Aboutus', function(req, res, next) {
  res.render('Aboutus');
});

router.get('/:id', function(req, res, next) {
  res.render('404');
});

router.post(
  '/image',
  singleMulterUpload('image'),
  asyncHandler(async (req, res) => {
    const imgUrl = await singlePublicFileUpload(req.file)

    return res.json({
      imgUrl,
    });
  })
);


module.exports = router;
