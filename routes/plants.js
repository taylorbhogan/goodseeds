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
    if (reviews.length){
        const ratingsArray = []

        for (let i = 0 ; i < reviews.length; i++){
            ratingsArray.push(reviews[i].rating)
        }

        const ratingSum = ratingsArray.reduce((accum, el) => {
            return accum + el;
        })
        avgRating = ratingSum/ratingsArray.length
    }
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



module.exports = router
