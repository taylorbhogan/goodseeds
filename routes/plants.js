const express = require('express');
const router = express.Router();
const db = require('../db/models');
const { asyncHandler, csrfProtection } = require('./utils');
const { requireAuth } = require('../auth');
const { Op } = require('sequelize');

router.get('/', csrfProtection, asyncHandler(async(req, res, next) => {
    const plants = await db.Plant.findAll();

    plants.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1)

    res.render('plants', { plants, csrfToken: req.csrfToken() })
}))

router.get('/new', requireAuth, csrfProtection, asyncHandler(async(req, res, next) => {
    const newPlant = await db.Plant.build();

    res.render('plants-new', { newPlant, csrfToken: req.csrfToken() })
}))

router.post('/new',
// csrfProtection,
asyncHandler(async(req, res, next) => {
    const { name, scientificName, imgUrl } = req.body;

    const plant = await db.Plant.create({
        name,
        scientificName,
        imgUrl,
    });

    const userId = req.session.auth.userId
    user = await db.User.findByPk(userId);


    const reviews = [];
    const usersShelves = [];
    const starRating = '☆☆☆☆☆'

    // console.log('--------------plant------------------>',plant);
    // console.log('--------------ID------------------>',plant.id);

    res.redirect(`/plants/${plant.id}`)

    // res.render('plants-id', { plant, reviews, usersShelves, user, starRating,
        // csrfToken: req.csrfToken()
    // } )
}))

router.post('/search', csrfProtection, asyncHandler(async(req, res, next) => {
    const { query } = req.body

    const plants = await db.Plant.findAll({
        where: {
            [Op.or]: [
                { name: { [Op.iLike]: '%' + query + '%'} },
                { scientificName: { [Op.iLike]: '%' + query + '%'} }
            ]
        }
    })

    plants.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1)

    res.render(`plants`, { plants, query, csrfToken: req.csrfToken() })
}))

router.get('/:id', csrfProtection, asyncHandler(async(req, res, next) => {
    const plant = await db.Plant.findByPk(req.params.id);
    if(plant == null) {
        res.redirect('/404')
      }
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

    let starRating = '☆☆☆☆☆'

    if (reviews.length){
        const ratingsArray = []

        for (let i = 0 ; i < reviews.length; i++){
            ratingsArray.push(reviews[i].rating)
            if (reviews[i].rating === 1) {
                reviews[i].rating = '⭐'
            } else if (reviews[i].rating === 2) {
                reviews[i].rating = '⭐⭐'
            } else if (reviews[i].rating === 3) {
                reviews[i].rating = '⭐⭐⭐'
            } else if (reviews[i].rating === 4) {
                reviews[i].rating = '⭐⭐⭐⭐'
            } else if (reviews[i].rating === 5) {
                reviews[i].rating = '⭐⭐⭐⭐⭐'
            }
        }

        const ratingSum = ratingsArray.reduce((accum, el) => {
            return accum + el;
        })
        let rating = ratingSum/ratingsArray.length;
        if (rating <= 1.4) {
            starRating = '⭐☆☆☆☆'
        } else if (rating <= 2.4) {
            starRating = '⭐⭐☆☆☆'
        } else if (rating <= 3.4) {
            starRating = '⭐⭐⭐☆☆'
        } else if (rating <= 4.4) {
            starRating = '⭐⭐⭐⭐☆'
        } else {
            starRating = '⭐⭐⭐⭐⭐'
        }
    }

    res.render('plants-id', { plant, reviews, usersShelves, user, starRating, csrfToken: req.csrfToken() } )
}));

router.get('/personal/:id', csrfProtection, asyncHandler(async(req, res, next) => {
    const plantToShelf = await db.PlantToShelf.findByPk(req.params.id)
    const plant = await db.Plant.findByPk(plantToShelf.plantId);
    const notes = await db.Note.findAll({
        where: {
            plantToShelfId: req.params.id
        }
    })
    if(plant == null) {
        res.redirect('/404')
      }

    let user;
    if (req.session.auth) {
        const userId = req.session.auth.userId
        user = await db.User.findByPk(userId);
      }

    res.render('plants-id-personal', { plant, user, notes, csrfToken: req.csrfToken() } )
}));

router.post('/:id', csrfProtection, requireAuth, asyncHandler(async(req, res, next) => {
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
    if(plant == null) {
        res.redirect('/404')
      }


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

router.get('/reviews/edit/:id', csrfProtection, requireAuth, asyncHandler(async(req, res) => {
    const review = await db.Review.findByPk(req.params.id);
    const plant = await db.Plant.findByPk(review.plantId);

    let starRating;
    if (review.rating === 1) {
        starRating = '⭐'
    } else if (review.rating === 2) {
        starRating = '⭐⭐'
    } else if (review.rating === 3) {
        starRating = '⭐⭐⭐'
    } else if (review.rating === 4) {
        starRating = '⭐⭐⭐⭐'
    } else {
        starRating = '⭐⭐⭐⭐⭐'
    }

    res.render('plants-id-edit', { plant, review, starRating, csrfToken: req.csrfToken() })
}))

router.post('/reviews/edit/:id', csrfProtection, requireAuth, asyncHandler(async(req, res) => {
    const review = await db.Review.findByPk(req.params.id)
    const plantId = review.plantId

    const { reviewText, rating } = req.body;

    await review.update({
        reviewText,
        rating,
    })

    res.redirect(`/plants/${plantId}`)
}))

//display the form that deletes the selected review
router.get('/reviews/delete/:id', csrfProtection, asyncHandler(async(req, res, next) => {
  const reviewId = parseInt(req.params.id, 10);
  const review = await db.Review.findByPk(reviewId);
  if(review == null) {
    res.redirect('/404')
  }
  const userId = req.session.auth.userId

  if(review.userId.toString() !== userId.toString()) {
    res.redirect('/')
  }

  res.render('deletereview', {review, reviewId, csrfToken: req.csrfToken()})
}))

//When you click the button, it deletes the review from the review table, and redirects you to the plant page
router.post('/reviews/delete/:id', csrfProtection, asyncHandler(async(req, res, next) => {
  const reviewId = parseInt(req.params.id, 10);
  const review = await db.Review.findByPk(reviewId);

  await review.destroy()

  res.redirect(`/plants/${review.plantId}`)
}))

// Delete a plant - GET
router.get('/delete/:id', csrfProtection, asyncHandler(async(req, res, next) => {
    const plantId = parseInt(req.params.id, 10);
    const plant = await db.Plant.findByPk(plantId)

    const userId = req.session.auth.userId

    if (plant == null){
        res.redirect('/404')
    }

    res.render('delete-plant', { plant, csrfToken: req.csrfToken() })
}))

// Delete a plant - POST
router.post('/delete/:id', csrfProtection, asyncHandler(async(req, res, next) => {
    const plantId = parseInt(req.params.id, 10)
    const plant = await db.Plant.findByPk(plantId)
    const plantToShelfReferences = await db.PlantToShelf.findAll({
        where: {
            plantId: plantId
        }
      })
    const reviews = await db.Review.findAll({
        where: {
            plantId: plantId
        }
    })
    for (let i = 0 ; i < plantToShelfReferences.length; i++){
        const reference = plantToShelfReferences[i]
        await reference.destroy()
    }
    for (let i = 0 ; i < reviews.length; i++){
        const review = reviews[i]
        await review.destroy()
    }

    await plant.destroy();

    res.redirect('/plants')

}))

module.exports = router
