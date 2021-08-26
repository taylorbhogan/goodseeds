var express = require('express');
var router = express.Router();

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



module.exports = router;
