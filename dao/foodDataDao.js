function getCollection() {
    return global.mongodb.collection('food_data');
}

async function saveFoodData(filter, set, upsert) {
    await getCollection().updateOne(filter, { $set: set }, { upsert: upsert });
}

async function findPage(param) {
    let filter = {};
    let sort = {};
    let project = { _id: 0, code: 1, name: 1, info: 1, classCode: 1, className: 1 };
    if (param.classCode) {
        filter.classCode = param.classCode;
    }
    if (param.searchWord) {
        filter.name = { $regex: param.searchWord };
    }
    if (param.lastValue) {
        filter[param.sortCol] = { $gt: param.lastValue };
    }
    param.elements.forEach((v) => {
        project[v] = 1;
    });
    sort[param.sortCol || 'code'] = param.direction ? parseInt(param.direction) : 1;
    let pageSize = 10;

    return await getCollection().find(filter).project(project).sort(sort).limit(pageSize).toArray();
}

async function findFoodInfo(filter, cols) {
    return await getCollection().findOne(filter || {}, { projection: cols || { _id: 0 } });
}

module.exports = {
    saveFoodData,
    findPage,
    findFoodInfo,
};
