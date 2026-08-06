const bcrypt = require('bcryptjs')
const { categories, banners, popularSearches, demoUsers } = require('./seed')
const config = require('./config')

let store = { categories: [], banners: [], popularSearches: [], users: [] }
let useMongo = false

function initMemoryStore() {
  store.categories = categories.map((c, i) => ({ ...c, _id: String(i + 1), isActive: true }))
  store.banners = banners.map((b, i) => ({ ...b, _id: String(i + 1), isActive: true }))
  store.popularSearches = popularSearches.map((s, i) => ({ ...s, _id: String(i + 1), isActive: true }))

  const rounds = config.bcryptRounds
  store.users = demoUsers.map((u, i) => {
    const hashed = bcrypt.hashSync(u.password, rounds)
    return {
      ...u,
      _id: String(i + 1),
      password: hashed,
      phone: u.phone || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  })

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

function findUserById(id) {
  return store.users.find((u) => u._id === id)
}

function findUserByIdentifier(identifier) {
  if (!identifier) return null
  if (identifier.includes('@')) {
    return store.users.find((u) => u.email.toLowerCase() === identifier.toLowerCase())
  }
  return store.users.find((u) => u.phone === identifier)
}

function createUser(data) {
  const rounds = config.bcryptRounds
  const hashed = bcrypt.hashSync(data.password, rounds)
  const user = {
    ...data,
    _id: String(Date.now()),
    password: hashed,
    phone: data.phone || '',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  store.users.push(user)
  return user
}

function getUserById(id) {
  return findUserById(id)
}

module.exports = { initMemoryStore, setMongoMode, isUsingMongo, getStore, findUserById, findUserByIdentifier, createUser, getUserById }
