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

module.exports = router
