const Router = require('express-promise-router')
const db = require('../../plugins/pg')

const router = Router()

router.get('/rss', async (req, res) => {
  const { offset, limit } = req.query

  const title = req.query.title === undefined ? '' : req.query.title
  const queryString =
    // 'SELECT no, title, link, rss_title, rss_episode, rss_season, rss_quality, rss_release_group ' +
    'SELECT no ' +
    '     , regexp_replace(title, \'/(\\.torrent|\\.mkv|\\.mp4|\\.tp|\\.ts)/\', \'\', \'ig\') AS title ' +
    '     , link ' +
    '     , regexp_replace(rss_title, \'/(\\.torrent|\\.mkv|\\.mp4|\\.tp|\\.ts|360p|720p|1080p)/\', \'\', \'ig\') AS rss_title ' +
    '     , rss_episode ' +
    '     , rss_season ' +
    '     , rss_quality ' +
    '     , rss_release_group ' +
    'FROM  "RSS" ' +
    'WHERE  title LIKE concat(\'%' + title + '%\')' +
    'ORDER BY no DESC ' +
    'OFFSET $1 LIMIT $2 '
  const { rows } = await db.query(queryString, [offset, limit])

  res.json(rows)
})

module.exports = router
