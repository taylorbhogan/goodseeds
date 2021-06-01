const express = require('express');
const router = express.Router();
const db = require('../db/models');
const { csrfProtection, asyncHandler } = require('./utils');
const {check, validationResult} = require('express-validator')

router.get('/', function(req, res, next) {
  const users = Users.FindAll()
  res.render('respond with a resource', {users});
});

router.get('/signup', csrfProtection, (req, res, next) =>{
  const user = db.User.build();
  res.render('users-signup', {
    csrfToken: req.csrfToken(),
    user
  });
});

const signupValidators = [
  check('firstName')
    .exists({checkFalsy: true})
    .withMessage('First name cannot be empty.')
    .isLength({max: 50})
    .withMessage('First name must be 50 characters or fewer.'),
  check('lastName')
    .exists({checkFalsy: true})
    .withMessage('Last name cannot be empty.')
    .isLength({max: 50})
    .withMessage('Last name must be 50 characters or fewer.'),
  check('username')
    .exists({checkFalsy: true})
    .withMessage('Username cannot be empty')
    .isLength({max: 50})
    .withMessage('Username must be 50 characters or fewer.')
    .custom((username) => {
      return db.User.findOne({where: {username}})
        .then((user) => {
          if (user) {
            return Promise.reject('The provided username is already in use; please pick another.')
          }
        })
      }),
  check('email')
    .exists({checkFalsy: true})
    .withMessage('Email cannot be empty.')
    .isLength({max: 255})
    .withMessage('Email must be 255 characters or fewer.')
    .isEmail()
    .withMessage('Please enter a valid email address.')
    .custom((email) => {
      return db.User.findOne({where: {email}})
        .then((user) => {
          if (user) {
            return Promise.reject('The provided email address is already in use; please pick another.')
          }
        })
      }),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Password cannot be empty.')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, 'g')
    .withMessage('Password must contain at least 1 lowercase letter, uppercase letter, number, and special character (i.e. "!@#$%^&*")'),
  
]

router.post('/signup', csrfProtection, asyncHandler(async(req, res, next) =>{
  const {
    firstName,
    lastName,
    username,
    email,
    password
  } = req.body;

  const user = await db.User.build({
    firstName,
    lastName,
    username,
    email
  })

  const signupErrors = validationResult(req)



  res.send('respond with a resource');
}));

router.get('/login', function(req, res, next) {
  res.send('respond with a resource');
});



module.exports = router;
