const express = require('express');
const router = express.Router();
const db = require('../db/models');
const { asyncHandler } = require('./utils');

router.get('/', asyncHandler(async(req, res, next) => {
    const plants = await db.Plant.findAll();
    res.render('plants', { plants })
}))

module.exports = router
