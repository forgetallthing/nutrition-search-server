function getCollection() {
    return global.mongodb.collection('food_data');
}

async function saveFoodData(filter, set, upsert) {
    await getCollection().updateOne(filter, { $set: set }, { upsert: upsert });
}

async function findPage(param) {
    let filter = {};
    let sort = {};
    if (param.lastValue) {
        filter[param.sortCol] = { $gt: param.lastValue };
    }
    sort[param.sortCol] = 1;
    let pageSize = 6;

    return await getCollection().find(filter, { _id: 0 }).sort(sort).limit(pageSize).toArray();
}

module.exports = {
    saveFoodData,
    findPage,
};
