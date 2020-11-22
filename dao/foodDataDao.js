function getCollection() {
    return global.mongodb.collection('food_data');
}

function getCollectCollection() {
    return global.mongodb.collection('food_collect');
}

async function saveFoodData(filter, set, upsert) {
    await getCollection().updateOne(filter, { $set: set }, { upsert: upsert });
}

async function findPage(param) {
    let filter = {};
    let sort = {};
    let project = { _id: 0, code: 1, name: 1, info: 1, classCode: 1, className: 1 };
    if (param.classCode) filter.classCode = param.classCode;
    if (param.searchWord) filter.name = { $regex: param.searchWord };
    if (param.lastValue) filter[param.sortCol] = { $gt: param.lastValue };
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

async function saveCollectFood(userId, foodCode) {
    await getCollectCollection().updateOne(
        { userId },
        {
            $set: {
                userId,
                foodCode,
            },
        },
        { upsert: true }
    );
}

async function findCollectFoods(userId) {
    return await getCollectCollection()
        .findMany({ userId }, { projection: { _id: 0 } })
        .toArray();
}

async function findCollectByFood(userId, foodCode) {
    return await getCollectCollection().findOne({ userId, foodCode }, { projection: { _id: 0 } });
}

async function findCollectByFoods(userId, foodCodes) {
    return await getCollectCollection()
        .findMany({ userId, foodCode: { $in: foodCodes } }, { projection: { _id: 0 } })
        .toArray();
}

async function removeCollectByFood(userId, foodCode) {
    await getCollectCollection().deleteOne({ userId, foodCode });
}

module.exports = {
    saveFoodData,
    findPage,
    findFoodInfo,
    findCollectFoods,
    saveCollectFood,
    findCollectByFood,
    findCollectByFoods,
    removeCollectByFood,
};
