const express = require('express');
const router = express.Router();
const db = require('../db/models');
const { asyncHandler } = require('./utils');

router.get('/', asyncHandler(async(req, res, next) => {
    const plants = await db.Plant.findAll();
    res.render('plants', { plants })
}))

router.get('/:id', asyncHandler(async(req, res, next) => {
    const plant = await db.Plant.findByPk(req.params.id);
    res.render('plants-id', { plant } )
}));

router.get('/:id/reviews', asyncHandler(async(req, res) => {
    const plant = await db.Plant.findByPk(req.params.id);

    res.render('plants-id-reviews', { plant })
}))

router.post('/:id/reviews', asyncHandler(async(req, res) => {
    const plantId = req.params.id
    // const userId = await db.User.findOne({
    //     where: {
    //         userId: res.locals.user
    //     }
    // })
    // console.log("req.session.auth.userId", req.session.auth.userId);
    const plant = await db.Plant.findByPk(req.params.id);
    const { reviewText, rating} = req.body;

    const newReview = db.Review.build({
        reviewText,
        rating,
        plantId,
        // userId
    })

    res.render('plants-id', { plant, newReview })
}))



module.exports = router
