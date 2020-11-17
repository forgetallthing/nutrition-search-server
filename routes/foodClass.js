const express = require('express');
const router = express.Router();
const foodClassDao = require('../dao/foodClassDao');
const { classMap } = require('../common/classMap');

router.get('/getElementClass', async function (req, res, next) {
    let list = await foodClassDao.findDic(
        {
            group: 'elementClass',
        },
        {
            _id: 0,
            group: 0,
            sn: 0,
        }
    );
    res.send({ list });
});

router.get('/getElement', async function (req, res, next) {
    let list = await foodClassDao.findDic(
        {
            group: 'element',
        },
        {
            _id: 0,
            group: 0,
            sn: 0,
        }
    );
    res.send({ list });
});

router.get('/getClass', async function (req, res, next) {
    let list = await foodClassDao.findClass({}, { _id: 0, sn: 0 });
    list.forEach((v) => {
        v.color = classMap[v.code].color;
        v.posi = classMap[v.code].posi;
    });
    res.send({ list });
});

module.exports = router;
