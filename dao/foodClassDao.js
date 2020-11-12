function getClassCollection() {
    return global.mongodb.collection('food_class');
}

async function saveClass(data) {
    await getClassCollection().insertMany(data);
}

async function delClass(filter) {
    await getClassCollection().deleteMany(filter || {});
}

async function findClass(filter, cols) {
    return await getClassCollection()
        .find(filter || {}, cols || { _id: 0 })
        .sort({ sn: 1 })
        .toArray();
}

module.exports = {
    saveClass,
    delClass,
    findClass,
};
