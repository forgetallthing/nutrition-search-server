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
        console.log(param,param.elements)
        let elements = JSON.parse(param.elements)
        elements.forEach((v) => {
            console.log(v)
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
