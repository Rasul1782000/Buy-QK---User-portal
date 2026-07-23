module.exports = {
  port: process.env.PORT || 5001,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/buyqk',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
}
