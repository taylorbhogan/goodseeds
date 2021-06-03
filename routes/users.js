const express = require('express');
const router = express.Router();
const db = require('../db/models');
const { csrfProtection, asyncHandler } = require('./utils');
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const { loginUser, logoutUser } = require('../auth');

router.get('/', asyncHandler(async(req, res, next) => {
  const users = await db.User.findAll()
  res.render('users', { users });
}));

router.get('/signup', csrfProtection, (req, res, next) =>{
  const user = db.User.build();
  res.render('users-signup', {
    csrfToken: req.csrfToken(),
    user
  });
});

router.post('/logout', (req, res) => {
  logoutUser(req, res);
  res.redirect('/users/login');
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
    loginUser(req,res,user);
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

router.get('/login', csrfProtection, (req, res, next)=>{
  res.render('users-login', {
    csrfToken: req.csrfToken()
  });
});

const loginValidators = [
  check('email')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Email Address'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Password'),
];

router.post('/login', csrfProtection, loginValidators,
  asyncHandler(async (req, res) => {
    const {
      email,
      password,
    } = req.body;

    let errors = [];
    const validatorErrors = validationResult(req);

    if (validatorErrors.isEmpty()) {
      // TODO Attempt to login the user.
      const user = await db.User.findOne({ where: { email } });

      if (user !== null) {
      const passwordMatch = await bcrypt.compare(password, user.hashPassword.toString());

      if (passwordMatch) {
        // If the password hashes match, then login the user
        // and redirect them to the default route.
        // TODO Login the user.
        loginUser(req,res,user);

        return res.redirect('/');
      }
    }
    errors.push('Login failed for the provided email address and password');
    } else {
      errors = validatorErrors.array().map((error) => error.msg);
    }

    res.render('users-login', {
      title: 'Login',
      email,
      errors,
      csrfToken: req.csrfToken(),
    });
  }));

router.get('/:id/shelves', asyncHandler(async(req, res, next) => {
  const user = await db.User.findByPk(req.params.id);
  // const userShelves = await db.Shelves.findAll({where: userId===user.id})
  res.render('users-id-shelves', {user})
}))

router.get('/account', asyncHandler(async(req, res, next) => {

  res.render('users-account')
}))

module.exports = router;

