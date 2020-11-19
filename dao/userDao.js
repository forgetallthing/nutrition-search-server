function getCollection() {
    return global.mongodb.collection('user');
}

async function saveUser(filter, info) {
    await getCollection().updateOne(filter, { $in: info }, { upsert: true });
}

module.exports = {
    saveUser,
};
