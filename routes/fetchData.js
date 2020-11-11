const express = require('express');
const router = express.Router();
const rp = require('request-promise-native');
const cheerio = require('cheerio');
const classDao = require('../dao/foodClassDao');
const foodDataDao = require('../dao/foodDataDao');
const dicDao = require('../dao/dicDao');

const elementClassDic = [
    { code: 'C1', name: '能量与相关成分' },
    { code: 'C2', name: '维生素' },
    { code: 'C3', name: '矿物质' },
    { code: 'C4', name: '脂肪酸' },
];
const elementDic = [
    { code: 'Edible', name: '食部', class: 'C1' },
    { code: 'Water', name: '水分', class: 'C1' },
    { code: 'Energy', name: '能量', class: 'C1' },
    { code: 'Protein', name: '蛋白质', class: 'C1' },
    { code: 'Fat', name: '脂肪', class: 'C1' },
    { code: 'Cholesterol', name: '胆固醇', class: 'C1' },
    { code: 'Ash', name: '灰分', class: 'C1' },
    { code: 'CHO', name: '碳水化合物', class: 'C1' },
    { code: 'DietaryFiber', name: '总膳食纤维', class: 'C1' },
    { code: 'Carotene', name: '胡萝卜素', class: 'C2' },
    { code: 'Vitamin', name: '维生素A', class: 'C2' },
    { code: 'αTE', name: 'α-TE', class: 'C2' },
    { code: 'Thiamin', name: '硫胺素', class: 'C2' },
    { code: 'Riboflavin', name: '核黄素', class: 'C2' },
    { code: 'Niacin', name: '烟酸', class: 'C2' },
    { code: 'VitaminC', name: '维生素C', class: 'C2' },
    { code: 'Ca', name: '钙', class: 'C3' },
    { code: 'P', name: '磷', class: 'C3' },
    { code: 'K', name: '钾', class: 'C3' },
    { code: 'Na', name: '钠', class: 'C3' },
    { code: 'Mg', name: '镁', class: 'C3' },
    { code: 'Fe', name: '铁', class: 'C3' },
    { code: 'Zn', name: '锌', class: 'C3' },
    { code: 'Se', name: '硒', class: 'C3' },
    { code: 'Cu', name: '铜', class: 'C3' },
    { code: 'Mn', name: '锰', class: 'C3' },
    { code: 'I', name: '碘', class: 'C3' },
    { code: 'SFA', name: '饱和脂肪酸', class: 'C4' },
    { code: 'MUFA', name: '单不饱和脂肪酸', class: 'C4' },
    { code: 'PUFA', name: '多不饱和脂肪酸', class: 'C4' },
];


router.get('/fetchData', async (req, res, next) => {
    let classInfo = await getCategoryInfo();
    await classDao.delClass();
    await classDao.saveClass(classInfo.classToplist);
    elementDic.forEach((v, i) => {
        v.group = 'element';
        v.sn = i + 1;
    });
    elementClassDic.forEach((v, i) => {
        v.group = 'elementClass';
        v.sn = i + 1;
    });
    await dicDao.delDic();
    await dicDao.saveDic(elementDic);
    await dicDao.saveDic(elementClassDic);
    for (let i = 0; i < classInfo.classlist.length; i++) {
        let v = classInfo.classlist[i];
        await getFoodInfo(v);
        console.log(`fetch ${v.className}`);
    }
    console.log('finish');
    res.send({ finish: 'ok' });
});

async function getFoodInfo(info) {
    let pageNum = 1;
    let url = getFoodInfoUrl(info.classTopCode, info.classCode, pageNum);
    let res = JSON.parse(await rp(url));
    let data = res.list;
    let totalPages = res.totalPages;
    pageNum++;
    for (; pageNum <= totalPages; pageNum++) {
        url = getFoodInfoUrl(info.classTopCode, info.classCode, pageNum);
        data = data.concat(JSON.parse(await rp(url)).list);
    }
    await saveFoodInfo(info, data);
}

async function saveFoodInfo(info, data) {
    let saveTasks = [];
    data.forEach((v) => {
        let curItem = {
            classCode: info.classTopCode,
            className: info.classTopName,
            info: info.className,
            code: v[0],
            name: v[2],
            alias: v[3],
            englishName: v[4],
            Edible: v[5],
            Water: v[6],
            Energy: v[7],
            Protein: v[8],
            Fat: v[9],
            Cholesterol: v[10],
            Ash: v[11],
            CHO: v[12],
            DietaryFiber: v[13],
            Carotene: v[14],
            Vitamin: v[15],
            αTE: v[16],
            Thiamin: v[17],
            Riboflavin: v[18],
            Niacin: v[19],
            VitaminC: v[20],
            Ca: v[21],
            P: v[22],
            K: v[23],
            Na: v[24],
            Mg: v[25],
            Fe: v[26],
            Zn: v[27],
            Se: v[28],
            Cu: v[29],
            Mn: v[30],
            I: v[31],
            SFA: v[32],
            MUFA: v[33],
            PUFA: v[34],
            Total: v[35],
        };
        saveTasks.push(foodDataDao.saveFoodData({ code: curItem.code }, curItem, true));
    });
    await Promise.all(saveTasks);
}

function getFoodInfoUrl(categoryOne, categoryTwo, pageNum) {
    return `https://fq.chinafcd.org/FoodInfoQueryAction!queryFoodInfoList.do?categoryOne=${categoryOne}&categoryTwo=${categoryTwo}&foodName=0&pageNum=${pageNum}&field=0&flag=0`;
}

async function getCategoryInfo() {
    const url = `https://fq.chinafcd.org/`;
    let classToplist = [];
    let classlist = [];
    let res = await rp(url);
    let $ = cheerio.load(res);
    let boxs = $('.food_box');
    for (let i = 0; i < boxs.length; i++) {
        let classes = $(boxs[i]).find('a');
        let classTopCode = classes[0].attribs.data_id;
        let classTopName = classes[0].lastChild.data;
        classToplist.push({ code: classTopCode, name: classTopName, sn: i + 1 });
        for (let j = 1; j < classes.length; j++) {
            classlist.push({
                classTopCode,
                classTopName,
                classCode: classes[j].attribs.data_id,
                className: classes[j].lastChild.data,
            });
        }
    }
    return {
        classToplist,
        classlist,
    };
}

module.exports = router;
