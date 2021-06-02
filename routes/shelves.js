const express = require('express');
const router = express.Router();
const db = require('../db/models');
const { asyncHandler } = require('./utils');

router.get('/:id', asyncHandler(async(req, res, next) => {
    const shelf = await db.Shelf.findByPk(req.params.id);
    res.render('shelf', { shelf })
}))

// router.get('/:id', asyncHandler(async(req, res, next) => {
//     const plant = await db.Plant.findByPk(req.params.id);
//     res.render('plants-id', { plant } )
// }));

module.exports = router
