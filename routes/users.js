const express = require('express');
const router = express.Router();
const db = require('../db/models');
const { csrfProtection, asyncHandler } = require('./utils');
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')

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
    .custom((value) => {
      return db.User.findOne({where: {email: value}})
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
  check('confirmPassword')
    .exists({ checkFalsy: true })
    .withMessage('Please confirm your password in this field')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('The confirmed password field does not match the password field')
      } else {
        return true;
      }
    })
]

router.post('/signup', csrfProtection, signupValidators, asyncHandler(async(req, res, next) =>{
  const {
    firstName,
    lastName,
    username,
    email,
    password
  } = req.body;

  const user = db.User.build({
    firstName,
    lastName,
    username,
    email
  })

  const signupErrors = validationResult(req)

  if (signupErrors.isEmpty()) {
    const hashPassword = await bcrypt.hash(password, 10);
    user.hashPassword = hashPassword;
    await user.save();
    res.redirect('/');
  } else {
    const errors = signupErrors.array().map((error) => error.msg);
    res.render('users-signup', {
      user,
      errors,
      csrfToken: req.csrfToken()
    })
  }
}));

router.get('/login', function(req, res, next) {
  res.send('');
});



module.exports = router;
