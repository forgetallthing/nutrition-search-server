// ==UserScript==
// @name         AutoLogin
// @namespace    http://ipromiseyourlife.com/
// @version      0.1
// @description  try to take over the world!
// @author       Z
// @match        http://*/page/login.html
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    // let vcodeAPI = 'http://localhost:8800/expand/getVerificationCode';
    let vcodeAPI = 'http://ipromiseyourlife.com/expand/getVerificationCode';

    let userInput = document.querySelector('input#user');
    let pwdInput = document.querySelector('input#pwd');
    let imgYzm = document.querySelector('img#codeimg');
    let inputYzm = document.querySelector('input#yzm');

    init();

    function init() {
        if (!userInput || !pwdInput || !imgYzm || !inputYzm) return;
        imgYzm.onload = function () {
            if (imgYzm.src.indexOf('login/addCode') != -1) readVcodeImg();
        };

        /**
         * 当localhost访问时，同一用户su可能有不同的密码，可使用以下方案解决：
         * 1.修改chrome的密码管理，su的密码为通用密码(无需改动)，设置用户名su_b的密码为b系统的密码；
         * 2.如想输入b系统的su用户的密码，可选择su_b；
         * 3.chrome自动填充好用户名和密码之后，本脚本自动将su_b修改为su；
         * 4.点击登录即可。
         */
        userInput.addEventListener('change', function () {
            if (/^su_.*/.test(userInput.value)) {
                userInput.value = 'su';
            }
        });
    }

    function readVcodeImg() {
        toDataURL(imgYzm.src, function (dataURL) {
            getVcode(dataURL);
        });
    }

    function getVcode(dataURL) {
        let url = vcodeAPI + '?img=' + encodeURIComponent(dataURL.replace(/.*,/, ''));
        let xhr = new XMLHttpRequest();
        xhr.open('get', url);
        xhr.onload = function () {
            let res = JSON.parse(xhr.response);
            if (res.err) {
                console.log(res.err);
            } else {
                setVcode(res.code, dataURL);
            }
        };
        xhr.send();
    }

    function setVcode(vcode, dataURL) {
        inputYzm.value = vcode.substr(0, 4);
        imgYzm.src = dataURL;
    }

    function toDataURL(url, callback) {
        let xhr = new XMLHttpRequest();
        xhr.open('get', url);
        xhr.responseType = 'blob';
        xhr.onload = function () {
            let fr = new FileReader();
            fr.onload = function () {
                callback(this.result);
            };
            fr.readAsDataURL(xhr.response);
        };
        xhr.send();
    }
})();
