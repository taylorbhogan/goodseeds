const express = require('express');
const router = express.Router();
const db = require('../db/models');
const { csrfProtection, asyncHandler } = require('./utils');

router.delete('/:id', asyncHandler(async(req, res)=> {
  // backend logic goes here

}))

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

    res.render('shelf', { plantsToShelves, shelf, comments, csrfToken: req.csrfToken()  })
}))

router.get('/planttoshelf/:id', csrfProtection, asyncHandler(async(req, res, next) => {
  const referenceId = parseInt(req.params.id, 10);
  const reference = await db.PlantToShelf.findByPk(referenceId);
  const shelf = await db.Plant.findByPk(reference.shelfId);
  const userId = req.session.auth.userId
  // if(shelf.userId !== userId) {
  //   console.log(`you do not own this shelf`)
  //   return
  // }
  res.render('deleteplanttoshelf', {reference, csrfToken: req.csrfToken()})
}))

router.post('/planttoshelf/:id', csrfProtection, asyncHandler(async(req, res, next) => {
  const referenceId = parseInt(req.params.id, 10);
  const reference = await db.PlantToShelf.findByPk(referenceId);
  const plant = await db.Plant.findByPk(reference.plantId);
  const shelf = await db.Shelf.findByPk(reference.shelfId);
  const shelfIdcloneToReferenceLater = reference.shelfId
  console.log(reference)
  //check permissions
  const userId = req.session.auth.userId
  console.log(userId)
  console.log(shelf.userId)
  if(shelf.userId !== userId) {
    console.log(`you do not own this shelf`)
    return
  }
  await reference.destroy();
  res.redirect(`/shelves/${shelfIdcloneToReferenceLater}`)
}));

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

    res.redirect(`users/${userId}/shelves`)
  }));

module.exports = router


// router.delete('/:id', csrfProtection, asyncHandler(async(req, res, next) => {  <---- Attempt to delete a shelf
//   const shelf = await db.Shelf.findByPk(req.params.id);
//   console.log(shelf)
//   const plantsToShelves = await db.PlantToShelf.findAll({
//     where: {
//       shelfId: shelf.id
//     },
//     include: {
//       model: db.Plant
//     }

//   })
// }))

// router.delete('/planttoshelf/:id', asyncHandler(async(req, res, next) => { <----- Attempt to use AJAX
//   console.log('test');
//   const referenceId = parseInt(req.params.id, 10);
//   const reference = await db.PlantToShelf.findByPk(referenceId);
//   const plant = await db.Plant.findByPk(reference.plantId);
//   const shelf = await db.Shelf.findByPk(reference.shelfId);
//   const shelfIdcloneToReferenceLater = reference.shelfId
//   console.log(reference)
//   //check permissions
//   const userId = req.session.auth.userId
//   console.log(userId)
//   console.log(shelf.userId)
//   if(shelf.userId !== userId) {
//     console.log(`you do not own this shelf`)
//     return
//   }
//   await reference.destroy();
//   res.json(`/shelves/${shelfIdcloneToReferenceLater}`)
//   }));
