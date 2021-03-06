const express = require('express');
const router = express.Router();
const foodDataDao = require('../dao/foodDataDao');

// todo:
// 1.值相同的反复加载bug
// 2.存成数值类型
router.get('/getList', async function (req, res, next) {
  let p = req.query;
  if (!p.sortCol) p.sortCol = 'code';
  p.count = parseInt(p.count);
  p.elements = JSON.parse(p.elements || '[]');
  let foodList = [];
  if (parseInt(p.collect)) {
    let collectCodes = await foodDataDao.findCollectFoods(p.userId);
    const codes = collectCodes.map((item) => {
      return item.foodCode;
    });
    foodList = await foodDataDao.findPage({ ...p, codes });
  } else {
    foodList = await foodDataDao.findPage(p);
  }

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
    foodCodes.push(obj.code);
    list.push(obj);
  });

  if (p.userId && !parseInt(p.collect)) {
    let collectList = await foodDataDao.findCollectByFoods(p.userId, foodCodes);
    list.forEach((v) => {
      if (collectList.find((val) => val.foodCode === v.code)) {
        v.isCollect = 1;
      } else {
        v.isCollect = 0;
      }
    });
  } else {
    list.forEach((v) => {
      v.isCollect = 1;
    });
  }
  res.send({ list });
});

router.get('/getfoodInfo', async function (req, res, next) {
  let p = req.query;
  let foodCode = JSON.parse(p.code);
  let info = await foodDataDao.findFoodInfo({ code: foodCode });
  if (p.userId) {
    const isCollect = await foodDataDao.findCollectByFood(p.userId, foodCode);
    if (isCollect) {
      info.isCollect = 1;
    } else {
      info.isCollect = 0;
    }
  }

  res.send({ info });
});

router.get('/getfoodAllList', async function (req, res, next) {
  let p = req.query;
  let list = await foodDataDao.findFoodAllList(p);
  res.send({ list });
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
