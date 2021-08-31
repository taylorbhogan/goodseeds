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
  '/image-plant',
  singleMulterUpload('image'),
  asyncHandler(async (req, res) => {
    const imgUrl = await singlePublicFileUpload(req.file)
    res.render('plants-new', { imgUrl })
  })
);

router.post(
  '/image-user',
  singleMulterUpload('image'),
  asyncHandler(async (req, res) => {
    const user = await db.User.findByPk(res.locals.user.id)
    const imgUrl = await singlePublicFileUpload(req.file)

    user.imgUrl = imgUrl
    await user.save()

    res.render('users-account-edit', { user })
  })
);


module.exports = router;
