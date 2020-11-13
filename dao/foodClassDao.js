function getClassCollection() {
    return global.mongodb.collection('food_class');
}

function getDicCollection() {
    return global.mongodb.collection('dic');
}

async function saveClass(data) {
    await getClassCollection().insertMany(data);
}

async function delClass(filter) {
    await getClassCollection().deleteMany(filter || {});
}

async function findClass(filter, cols) {
    return await getClassCollection()
        .find(filter || {})
        .project(cols || { _id: 0 })
        .sort({ sn: 1 })
        .toArray();
}

async function findDic(filter, cols) {
    return await getDicCollection()
        .find(filter || {})
        .project(cols || { _id: 0 })
        .sort({ sn: 1 })
        .toArray();
}

module.exports = {
    saveClass,
    delClass,
    findClass,
    findDic,
};
