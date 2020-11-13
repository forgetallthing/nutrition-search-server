const express = require('express');
const router = express.Router();
const foodDataDao = require('../dao/foodDataDao');

router.get('/getList', async function (req, res, next) {
    let p = req.query;
    p.lastValue = parseInt(p.lastValue);
    p.elements = JSON.parse(p.elements || '[]');
    let foodList = await foodDataDao.findPage(p);
    let list = [];
    foodList.forEach((v) => {
        let obj = { eles: {} };
        for (const key in v) {
            if (p.elements.includes(key)) {
                obj.eles[key] = v[key];
            } else {
                obj[key] = v[key];
            }
        }
        list.push(obj);
    });
    res.send({ list });
});

router.get('/getfoodInfo', async function (req, res, next) {
    let p = req.query;
    let info = await foodDataDao.findFoodInfo({ code: JSON.parse(p.code) });
    res.send({ info });
});

module.exports = router;
