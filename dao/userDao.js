function getCollection() {
    return global.mongodb.collection('user');
}

async function saveUser(filter, info) {
    await getCollection().updateOne(filter, { $set: info }, { upsert: true });
}

async function findUser(filter, cols) {
    return await getCollection().findOne(filter || {}, { projection: cols || { _id: 0 } });
}

module.exports = {
    saveUser,
    findUser,
};
