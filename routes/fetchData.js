var express = require('express');
var router = express.Router();
var rp = require('request-promise-native');

router.get('/fetchData', async (req, res, next) => {
    const url = `https://fq.chinafcd.org/FoodInfoQueryAction!queryFoodInfoList.do`;
    rp({
        url,
        method: 'get',
    })
        .then(function (res) {
            console.log(res);
        })
        .catch(function (err) {
            console.log(err);
        });

    res.send({ apple: [] });
});

module.exports = router;
