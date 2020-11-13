function getCollection() {
    return global.mongodb.collection('food_data');
}

async function saveFoodData(filter, set, upsert) {
    await getCollection().updateOne(filter, { $set: set }, { upsert: upsert });
}

async function findPage(param, project) {
    let filter = {};
    let sort = {};
    if (param.classCode) {
        filter.classCode = param.classCode;
    }
    if (param.searchWord) {
        filter.name = { $regex: param.searchWord };
    }
    if (param.lastValue) {
        filter[param.sortCol] = { $gt: param.lastValue };
    }
    if (param.elements) {
        let elements = JSON.parse(param.elements);
        elements.forEach((v) => {
            project[v] = 1;
        });
    }
    sort[param.sortCol || 'code'] = param.direction ? parseInt(param.direction) : 1;
    let pageSize = 6;

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
