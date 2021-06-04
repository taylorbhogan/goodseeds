const express = require('express');
const router = express.Router();
const db = require('../db/models');
const { csrfProtection, asyncHandler } = require('./utils');

router.get('/:id', csrfProtection, asyncHandler(async(req, res, next) => {
    const shelf = await db.Shelf.findByPk(req.params.id);
    const comments = await db.Comment.findAll({
      where: {
        shelfId: req.params.id
      },
      include: db.User
    })

    const plantsToShelves = await db.PlantToShelf.findAll({
      where: {
        shelfId: shelf.id
      },
      include: {
        model: db.Plant
      }
    })

    res.render('shelf', { plantsToShelves, shelf, comments, csrfToken: req.csrfToken() })
}))

router.post('/', csrfProtection, asyncHandler(async(req, res, next) => {
    const userId = req.session.auth.userId
    const user = await db.User.findByPk(userId);

    const {name} = req.body;

    const shelf = db.Shelf.build({
      userId,
      name
    })

    await shelf.save();
    const shelves = await db.Shelf.findAll({
      where: {
        userId: userId
      }
    });
    //   res.render('users-id-shelves', {user, shelves, csrfToken: req.csrfToken() });
    // catch {
    res.redirect(`users/${userId}/shelves`)
    // }

  }));
// router.get('/:id', asyncHandler(async(req, res, next) => {
//     const plant = await db.Plant.findByPk(req.params.id);
//     res.render('plants-id', { plant } )
// }));



module.exports = router
