'use strict';
const { MongoClient, ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const path = require('path')

// INSERT: Thêm mới (một)
function insertDocument(data, collectionName) {
  return new Promise((resolve, reject) => {
    mongoose.model(collectionName)
      .create(data)
      .then((result) => {
        resolve({ result: result });
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function insertDocuments(list, collectionName) {
  return new Promise((resolve, reject) => {
    mongoose.model(collectionName)
      .insertMany(list)
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

// ----------------------------------------------------------------------------
// UPDATE: Sửa

function updateDocument(condition, data, collectionName) {
  return new Promise((resolve, reject) => {
    mongoose.model(collectionName)
      .findOneAndUpdate(condition, { $set: data })
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function findDocument(id ,collectionName) {
  return new Promise((resolve, reject) => {
    const collection = mongoose.model(collectionName);
    const query = { _id: id };
    collection
      .findOne(query)
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function toSafeFileName(fileName) {
  const fileInfo = path.parse(fileName);

  const safeFileName = fileInfo.name.replace(/[^a-z0-9]/gi, '-').toLowerCase() + fileInfo.ext;
  return `${Date.now()}-${safeFileName}`;
}

module.exports = { insertDocument, insertDocuments, updateDocument, findDocument, toSafeFileName };