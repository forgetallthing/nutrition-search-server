const express = require('express');
const router = express.Router();
const foodDataDao = require('../dao/foodDataDao');

router.get('/getList', async function (req, res, next) {
    let p = req.query;
    p.lastValue = parseInt(p.lastValue);
    let baseCols = { _id: 0, code: 1, name: 1, info: 1, classCode: 1, className: 1 };
    let foodList = await foodDataDao.findPage(p, baseCols);
    let list = [];
    foodList.forEach((v) => {
        let obj = { eles: {} };
        for (const key in v) {
            if (baseCols[key]) {
                obj[key] = v[key];
            } else {
                obj.eles[key] = v[key];
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
