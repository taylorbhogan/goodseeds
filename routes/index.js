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
    console.log('inside /image route ______-------------_______');
    const imgUrl = await singlePublicFileUpload(req.file)
    console.log('inside /image route ______-------------_______',imgUrl);
    
    return res.json({
      imgUrl,
    });
  })
);


module.exports = router;
