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
  return await getCompareCollection()
    .find(filter)
    .sort({ saveTime: -1 })
    .toArray();
}

async function deleteCompareRecord(_id) {
  await getCompareCollection().deleteOne({ _id: toObjectID(_id) });
}

module.exports = {
  saveCompareRecord,
  getCompareRecord,
  deleteCompareRecord,
};
