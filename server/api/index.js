const express = require('express')
const bodyParser = require('body-parser')

const router = express.Router()

// Require API routes
const rss = require('./rss')
const download = require('./download')

// parse JSON and url-encoded query
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

// Import API Routes
router.use(rss)
router.use(download)

// Export the server middleware
module.exports = router
