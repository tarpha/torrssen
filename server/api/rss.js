const Router = require('express-promise-router')
const fs = require('fs')
const db = require('../../plugins/pg')

const router = Router()

const queryString = fs.readFileSync('sql/select.sql').toString()

router.get('/rss', async (req, res) => {
  const { offset, limit } = req.query
  const title = req.query.title === undefined ? '' : req.query.title

  const { rows } = await db.query(queryString, [title, offset, limit])

  res.json(rows)
})

module.exports = router
