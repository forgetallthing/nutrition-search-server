const express = require('express');
const router = express.Router();
const foodDataDao = require('../dao/foodDataDao');

router.get('/getList', async function (req, res, next) {
    let p = req.query;
    p.page = parseInt(p.page);
    p.lastValue = parseInt(p.lastValue);
    let list = await foodDataDao.findPage(p);
    res.send({ list });
});

module.exports = router;
