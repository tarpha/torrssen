const express = require('express')

// Create express instnace
const app = express()

// Require API routes
const rss = require('./routes/rss')

// Import API Routes
app.use(rss)

// Export the server middleware
module.exports = {
  path: '/api',
  handler: app
}
