const express = require('express');
const router = express.Router();
const db = require('../db/models');
const { asyncHandler, csrfProtection } = require('./utils');
const { requireAuth } = require('../auth');

router.get('/', asyncHandler(async(req, res, next) => {
    const plants = await db.Plant.findAll();
    res.render('plants', { plants })
}))

router.get('/:id', csrfProtection, asyncHandler(async(req, res, next) => {
    const plant = await db.Plant.findByPk(req.params.id);
    const reviews = await db.Review.findAll({
        where: {
            plantId: req.params.id
        },
        include: db.User
    })

    let usersShelves;
    let user;
    if (req.session.auth) {
        const userId = req.session.auth.userId
        user = await db.User.findByPk(userId);
        if (user) {
            usersShelves = await db.Shelf.findAll({
                where: {
                    userId: userId
                }
            });
        }
      }

    let avgRating = 0;
    // let ratingOne = function(ratingNum) {
    //     return
    // }
    // const array = [];
    if (reviews.length){
        const ratingsArray = []

        for (let i = 0 ; i < reviews.length; i++){
            ratingsArray.push(reviews[i].rating)
            // array.push(reviews[i].rating)
        }

        const ratingSum = ratingsArray.reduce((accum, el) => {
            return accum + el;
        })
        let rating = ratingSum/ratingsArray.length;
        avgRating = rating.toFixed(1);
    }

    // const whetherRatingIsOne = function(rating) {
    //     if(rating === 1) {
    //        return true
    //      } else {
    //         return false
    //      }
    // }
    res.render('plants-id', { plant, reviews, usersShelves, user, avgRating, csrfToken: req.csrfToken() } )
}));

router.post('/:id', csrfProtection, requireAuth, asyncHandler(async(req, res, next) => {
    const plant = await db.Plant.findByPk(req.params.id);
    const reviews = await db.Review.findAll({
        where: {
            plantId: req.params.id
        }
    })
    const userId = req.session.auth.userId
    const user = await db.User.findByPk(userId);
    const usersShelves = await db.Shelf.findAll({
        where: {
          userId: userId
        }
      });

    const {selectedshelf} = req.body;

    const newPlantToShelfConnection = db.PlantToShelf.build({
        plantId: req.params.id,
        shelfId: selectedshelf
    })

    await newPlantToShelfConnection.save();

    res.redirect(`../shelves/${selectedshelf}`)
}));

router.get('/:id/reviews', csrfProtection, requireAuth, asyncHandler(async(req, res) => {
    const plant = await db.Plant.findByPk(req.params.id);

    res.render('plants-id-reviews', { plant, csrfToken: req.csrfToken() })
}))

router.post('/:id/reviews', csrfProtection, requireAuth, asyncHandler(async(req, res) => {
    const plantId = req.params.id
    const user = await db.User.findByPk(req.session.auth.userId)
    const userId = user.id

    const { reviewText, rating } = req.body;

    const newReview = db.Review.build({
        reviewText,
        rating,
        plantId,
        userId
    })

    await newReview.save();

    res.redirect(`/plants/${plantId}`)
}))

//display the form that deletes the selected reviuew
router.get('/reviews/delete/:id', csrfProtection, asyncHandler(async(req, res, next) => {
  const reviewId = parseInt(req.params.id, 10);
  const review = await db.Review.findByPk(reviewId);
  const userId = req.session.auth.userId

  console.log(review.userId);
  console.log('-----------------')
  console.log(userId)

  if(review.userId.toString() !== userId.toString()) {
    // window.alert('You do not own this review.')
    res.redirect('/')
  }

  res.render('deletereview', {review, reviewId, csrfToken: req.csrfToken()})
}))

//When you click the button, it deletes the review from the review table, and redirects you to the plant page
router.post('/reviews/delete/:id', csrfProtection, asyncHandler(async(req, res, next) => {
  const reviewId = parseInt(req.params.id, 10);
  const review = await db.Review.findByPk(reviewId);
  const userId = req.session.auth.userId

  // if(shelf.userId !== userId) {
  //   console.log(`you do not own this shelf`)
  //   return
  // }

  await review.destroy()

  res.redirect(`/plants/${review.plantId}`)
}))

module.exports = router
