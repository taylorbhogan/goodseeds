var express = require('express');
var router = express.Router();
const db = require('../db/models');
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

    const newPlant = await db.Plant.build();
    newPlant.imgUrl = imgUrl;
    console.log('---------------newPlant-------------->>>',newPlant);
    res.render('plants-new', { newPlant })

  })
);


module.exports = router;
