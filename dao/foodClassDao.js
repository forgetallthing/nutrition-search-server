function getClassCollection() {
    return global.mongodb.collection('food_class');
}

async function saveClass(data) {
    await getClassCollection().insertMany(data);
}

async function delClass(filter) {
    await getClassCollection().deleteMany(filter || {});
}

module.exports = {
    saveClass,
    delClass,
};
