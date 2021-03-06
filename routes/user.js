const express = require('express');
const router = express.Router();
const rp = require('request-promise-native');
const CONFIG = require('../common/config');
const userDao = require('../dao/userDao');

router.post('/login', async function (req, res, next) {
    let p = req.body;
    if (!p.code) {
        res.send({ errmsg: '无临时登录凭证，请检查' });
        return;
    }
    const getOpenidUrl = `https://api.weixin.qq.com/sns/jscode2session?appid=${CONFIG.WX_CONFIG.APPID}&secret=${CONFIG.WX_CONFIG.SECRET}&js_code=${p.code}&grant_type=authorization_code`;
    let options = {
        url: getOpenidUrl,
        method: 'get',
    };
    let result = JSON.parse(await rp(options));
    if (result.errcode) {
        res.send({ errmsg: '获取用户Id失败' + result.errcode + result.errmsg });
        return;
    }

    let openid = result.openid;
    let loginTime = Date.now();
    await userDao.saveUser({ openid }, { openid, loginTime });
    let user = await userDao.findUser({ openid }, {});
    
    res.send({ userId: user._id });
});

module.exports = router;
