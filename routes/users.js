const express = require('express');
const router = express.Router();
const db = require('../db/models');
const { csrfProtection, asyncHandler } = require('./utils');

/* GET users listing. */
router.get('/', function(req, res, next) {
  const users = Users.FindAll()
  res.render('respond with a resource', {users});
});

router.get('/signup', (req, res, next) =>{
  const user = db.User.build();
  res.render('users-signup');
});

router.post('/signup', asyncHandler(async(req, res, next) =>{
  res.send('respond with a resource');
}));

router.get('/login', function(req, res, next) {
  res.send('respond with a resource');
});



module.exports = router;
