const { categories, banners, popularSearches } = require('./seed')

let store = { categories: [], banners: [], popularSearches: [] }
let useMongo = false

function initMemoryStore() {
  store.categories = categories.map((c, i) => ({ ...c, _id: String(i + 1), isActive: true }))
  store.banners = banners.map((b, i) => ({ ...b, _id: String(i + 1), isActive: true }))
  store.popularSearches = popularSearches.map((s, i) => ({ ...s, _id: String(i + 1), isActive: true }))
  useMongo = false
}

function setMongoMode() {
  useMongo = true
}

function isUsingMongo() {
  return useMongo
}

function getStore() {
  return store
}

module.exports = { initMemoryStore, setMongoMode, isUsingMongo, getStore }
