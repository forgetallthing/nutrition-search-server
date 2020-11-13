function getCollection() {
    return global.mongodb.collection('food_data');
}

async function saveFoodData(filter, set, upsert) {
    await getCollection().updateOne(filter, { $set: set }, { upsert: upsert });
}

async function findPage(param) {
    let filter = {};
    let sort = {};
    let project = { _id: 0 };
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
        param.elements.forEach((v) => {
            project[v] = 1;
        });
    }
    sort[param.sortCol] = param.direction ? 1 : parseInt(param.direction);
    let pageSize = 6;

    return await getCollection().find(filter).project(project).sort(sort).limit(pageSize).toArray();
}

module.exports = {
    saveFoodData,
    findPage,
};
