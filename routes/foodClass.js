const express = require('express');
const router = express.Router();
const foodClassDao = require('../dao/foodClassDao');

router.get('/getClass', async function (req, res, next) {
    let list = await foodClassDao.findClass();
    res.send({ list });
});

module.exports = router;
