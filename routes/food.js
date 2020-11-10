var express = require('express');
var router = express.Router();

router.get('/getList', function (req, res, next) {
    res.send({ apple: [] });
});

module.exports = router;
