const express = require('express');
const router = express.Router();
const CONFIG = require('../common/config');
const toolDao = require('../dao/toolDao');

router.get('/saveCompare', async function (req, res, next) {
    let p = req.body;
    res.send({});
});

module.exports = router;
