const express = require('express');
const router = express.Router();
const toolDao = require('../dao/toolDao');

router.post('/saveCompare', async function (req, res, next) {
  let p = req.body;
  let saveTime = Date.now();
  toolDao.saveCompareRecord({ saveTime }, { ...p, saveTime });
  res.send({});
});

router.get('/getCompare', async function (req, res, next) {
  let p = req.query;
  const data = await toolDao.getCompareRecord(p);
  console.log(data);
  res.send({ data });
});

module.exports = router;
