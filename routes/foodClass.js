const express = require('express');
const router = express.Router();
const foodClassDao = require('../dao/foodClassDao');
const { classMap } = require('../common/classMap');

router.get('/getClass', async function (req, res, next) {
    let list = await foodClassDao.findClass();
    list.forEach((v) => {
        v.color = classMap[v.code].color;
        v.posi = classMap[v.code].posi;
    });
    res.send({ list });
});

module.exports = router;
