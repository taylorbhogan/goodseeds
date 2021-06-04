const express = require('express');
const router = express.Router();
const db = require('../db/models');
const { csrfProtection, asyncHandler } = require('./utils');
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const { loginUser, logoutUser } = require('../auth');

const entryDestroyer = async (entryToDestroy) => {
  await entryToDestroy.destroy()
}

/*
GET /users page
Displays all users along with links to their
*/
router.get('/', asyncHandler(async(req, res, next) => {
  const users = await db.User.findAll()
  res.render('users', { users });
}));

/*
GET /users/signup page
Displays form for new users to create an account
*/
router.get('/signup', csrfProtection, (req, res, next) =>{
  const user = db.User.build();
  res.render('users-signup', {
    csrfToken: req.csrfToken(),
    user
  });
});

/*
GET /users/login page
Displays form for existing users to login
*/
router.get('/login', csrfProtection, (req, res, next)=>{
  res.render('users-login', {
    csrfToken: req.csrfToken()
  });
});

router.get('/account/delete', csrfProtection, asyncHandler(async(req, res, next) => {
  // const userToDelete = res.locals.user
  // console.log("LOOK HERE GUYS", userToDelete);
  res.render('users-account-delete', { csrfToken: req.csrfToken() })
}))

/*
GET /users/account page
Displays logged in user's account information
*/
router.get('/account', asyncHandler(async(req, res, next) => {
  res.render('users-account')
}))

/*
GET /users/:id/shelves page
Displays list of all of the logged in user's shelves
*/
router.get('/:id/shelves', csrfProtection, asyncHandler(async(req, res, next) => {
  console.log('RES.LOCALS ', res.locals.user.firstName)
  const testUser = res.locals.user.firstName
  const user = await db.User.findByPk(req.params.id);
  const shelves = await db.Shelf.findAll({
    where: {
      userId: req.params.id
    }
  });
  res.render('users-id-shelves', {user, testUser, shelves, csrfToken: req.csrfToken()})
}))

router.get('/account/delete', csrfProtection, asyncHandler(async(req, res, next) => {
  res.render('users-account-delete', { csrfToken: req.csrfToken() })
}))

// INCOMPLETE, REVISIT AFTER FINSIHING USER AUTHENTICATION
// router.post('/account/delete', csrfProtection, asyncHandler(async(req, res, next) => {

//   res.render('users-account-delete', { csrfToken: req.csrfToken() })
// }))

/*
POST /users/logout page
Logs out user from their account and redirects to /users/login page
*/
router.post('/logout', (req, res) => {
  logoutUser(req, res);
  res.redirect('/users/login');
});

router.post('/account/delete', asyncHandler(async(req, res, next) => {
  const userToDelete = res.locals.user
  const shelves = await db.Shelf.findAll({
    where: {
      userId: userToDelete.id
    }
  })
  // Delete all reviews
  const reviews = await db.Review.findAll({
    where: {
      userId: userToDelete.id
    }
  })

  reviews.forEach((review => {
    entryDestroyer(review)
  }));

  // Delete all comments
  const comments = await db.Comment.findAll({
    where: {
      userId: userToDelete.id
    }
  })

  comments.forEach((comment => {
    entryDestroyer(comment)
  }));

  // Delete all plant-to-shelf connections
  for (let i = 0; i < shelves.length; i++) {
    const shelf = shelves[i];

    await db.PlantToShelf.destroy({
      where: {
        shelfId: shelf.id
      }
    })
  }
  // Delete all shelves
  shelves.forEach((shelf => {
    entryDestroyer(shelf)
  }));

  logoutUser(req,res)
  await userToDelete.destroy()
    res.redirect('/')
  }))

/*
Array of validators to check against new account creation/sign up constraints
*/
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

/*
POST /users/signup page
Creates new account for new users then redirects to / page
*/
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

/*
Array of validators to check against log in constraints
*/
const loginValidators = [
  check('email')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Email Address'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Password'),
];

/*
POST /users/login page
Signs in existing user then redirects to / page
*/
router.post('/login', csrfProtection, loginValidators, asyncHandler(async (req, res) => {
    const {
      email,
      password,
    } = req.body;

  let errors = [];
  const validatorErrors = validationResult(req);

  if (validatorErrors.isEmpty()) {
    const user = await db.User.findOne({ where: { email } });

    if (user !== null) {
    const passwordMatch = await bcrypt.compare(password, user.hashPassword.toString());

    if (passwordMatch) {
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

router.get('/:id/shelves', csrfProtection, asyncHandler(async(req, res, next) => {
  const tempUser = await db.User.findByPk(req.params.id);
  const shelves = await db.Shelf.findAll({
    where: {
      userId: req.params.id
    }
  });
  console.log(res.locals.user.firstName);
  res.render('users-id-shelves', {tempUser, shelves, csrfToken: req.csrfToken()})
}))

router.get('/account', asyncHandler(async(req, res, next) => {

  res.render('users-account')
}))



  //perhaps delete shelf in /shelves/:id. dont know how I would get the shelf ID

module.exports = router;
