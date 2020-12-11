function getCompareCollection() {
  return global.mongodb.collection('compareTool');
}

async function saveCompareRecord(filter, set) {
  await getCompareCollection().updateOne(
    filter,
    { $set: set },
    { upsert: true }
  );
}

async function getCompareRecord(filter) {
  return await getCompareCollection().find(filter).toArray();
}
module.exports = {
  saveCompareRecord,
  getCompareRecord,
};
