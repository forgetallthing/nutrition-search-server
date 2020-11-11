function getCollection() {
    return global.mongodb.collection('dic');
}

async function saveDic(data) {
    await getCollection().insertMany(data);
}

async function delDic(filter) {
    await getCollection().deleteMany(filter || {});
}

module.exports = {
    saveDic,
    delDic,
};
