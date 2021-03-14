// 临时脚本的接口,获取验证码
var express = require('express');
var router = express.Router();
const crypto = require('crypto');
var { codes } = require('../expandScript/VerificationCodes');

// var url="http://127.0.0.1:8800/expand/getVerificationCode";
router.get('/getVerificationCode', function (req, res, next) {
    let img = req.query.img;
    if (!img) res.send({ err: '请求中无验证码图片' });
    let curMD5 = crypto.createHash('md5').update(img).digest('hex');
    let vcode = codes[curMD5];
    res.send(vcode ? { code: vcode } : { err: '没有找到匹配的验证码' });
});

module.exports = router;
