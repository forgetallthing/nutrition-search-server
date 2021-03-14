// 为自动输入验证码功能设计，批量将./cap文件夹中的验证码图片转为base64，再用md5加密
// cap中图片过多，本程序不保留cap文件夹，使用本脚本可拷贝到本地执行

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

let filePath = path.resolve('./cap/');
let result = {};
let files = fs.readdirSync(filePath);
files.forEach(function (filename) {
    let filedir = path.join(filePath, filename);
    let content = new Buffer(fs.readFileSync(filedir)).toString('base64');
    result[crypto.createHash('md5').update(content).digest('hex')] = filename;
});

fs.writeFile('./result.txt', JSON.stringify(result), {}, () => {});