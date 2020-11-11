function getCollection() {
    return global.mongodb.collection('food_data');
}

async function saveFoodData(filter, set, upsert) {
    await getCollection().updateOne(filter, { $set: set }, { upsert: upsert });
}

module.exports = {
    saveFoodData,
};
