const express = require('express');
const router = express.Router();
const foodDataDao = require('../dao/foodDataDao');

router.get('/getList', async function (req, res, next) {
    let p = req.query;
    p.lastValue = parseInt(p.lastValue);
    p.elements = JSON.parse(p.elements || '[]');
    let foodList = await foodDataDao.findPage(p);
    let list = [];
    let foodCodes = [];
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

    if (p.userId && !p.collect) {
        let collectList = await foodDataDao.findCollectByFoods(p.userId, foodCodes);
        foodList.forEach((v) => {
            if (collectList.find((val) => val.foodCode === v.code)) v.isCollect = 1;
        });
    }
    res.send({ list });
});

router.get('/getfoodInfo', async function (req, res, next) {
    let p = req.query;
    let foodCode = JSON.parse(p.code);
    let info = await foodDataDao.findFoodInfo({ code: foodCode });
    if (p.userId) {
        if (await foodDataDao.findCollectByFood(p.userId, foodCode)) info.isCollect = 1;
    }

    res.send({ info });
});

router.get('/collectFood', async function (req, res, next) {
    let p = req.query;
    if (!p.userId) {
        res.send({ errmsg: '无用户ID' });
        return;
    }
    let foodCode = JSON.parse(p.code);
    let isCollect = await foodDataDao.findCollectByFood(p.userId, foodCode);
    if (!isCollect) await foodDataDao.saveCollectFood(p.userId, foodCode);
    res.send({});
});

router.get('/unCollectFood', async function (req, res, next) {
    let p = req.query;
    if (!p.userId) {
        res.send({ errmsg: '无用户ID' });
        return;
    }
    let foodCode = JSON.parse(p.code);
    await foodDataDao.removeCollectByFood(p.userId, foodCode);
    res.send({});
});

module.exports = router;
