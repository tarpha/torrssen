const Router = require('express-promise-router')
const fs = require('fs')
const db = require('../../plugins/pg')
const Parser = require('rss-parser')

const parser = new Parser()
const router = Router()

router.get('/rss', async (req, res) => {
  let { offset, limit, title } = req.query

  title = title === undefined ? '' : title

  if (title && title.split(' ').length > 1) {
    const queryString = fs.readFileSync('sql/select_title.sql').toString()
    const { rows } = await db.query(queryString, [title, offset, limit])

    res.json(rows)
  } else {
    const queryString = fs.readFileSync('sql/select.sql').toString()
    const { rows } = await db.query(queryString, [title, offset, limit])

    res.json(rows)
  }
})

router.get('/rss/php', async (req, res) => {
  const { offset, limit } = req.query
  const title = req.query.title === undefined ? '' : '&k=' + req.query.title

  const page = offset === 0 ? 1 : offset / limit + 1

  const feed = await parser.parseURL(
    encodeURI(process.env.RSSURL + '&page=' + page + title)
  )

  const ret = []
  let index = offset

  feed.items.forEach(el => {
    let episode = el.title.match(/e(\d{2,})/i)
    let season = el.title.match(/s(\d{1,})/i)
    season = season === null ? el.title.match(/시즌(\d{1,})/i) : season
    let quality = el.title.match(/\d{3,4}p/i)
    let releaseGroup = 'OTHERS'
    if (el.title.search(/next/i) !== -1) {
      releaseGroup = 'NEXT'
    } else if (el.title.search(/once/i) !== -1) {
      releaseGroup = 'Once'
    } else if (el.title.search(/Chaos/i) !== -1) {
      releaseGroup = 'Chaos'
    } else if (el.title.search(/Hel/i) !== -1) {
      releaseGroup = 'Hel'
    }

    el.no = index
    el.title = el.title.replace(/(\.torrent|\.mkv|\.mp4|\.tp|\.ts)/gi, '')
    el.rss_title = el.title.replace(
      /(\.torrent|\.mkv|\.mp4|\.tp|\.ts|360p|720p|1080p)/gi,
      ''
    )
    el.rss_episode = episode === null ? 0 : episode[1]
    el.rss_season = season === null ? 1 : season[1]
    el.rss_quality = quality === null ? '' : quality[0]
    el.rss_release_group = releaseGroup
    el.tid = 0
    el.target = ''
    ret.push(el)
    index++
  })

  res.json(ret)
})

router.get('/rss/url', async (req, res) => {
  const { offset, limit } = req.query
  const { url, searchKey, searchVal, boardKey, boardVal, pageKey, linkKey} = JSON.parse(decodeURI(req.query.rss))
  const title = req.query.title === undefined ? '' : '&' + searchKey + '=' + req.query.title + (searchVal ? '+' + searchVal : '')

  const page = offset === 0 ? 1 : offset / limit + 1

  const feed = await parser.parseURL(
    encodeURI(url + '?a=a'
      + (pageKey ? '&' + pageKey + '=' + page : '') 
      + (boardKey ? '&' + boardKey + '=' + boardVal : '') 
      + title)
  )

  const ret = []
  let index = offset

  feed.items.forEach(el => {
    let episode = el.title.match(/e(\d{2,})/i)
    let season = el.title.match(/s(\d{1,})/i)
    season = season === null ? el.title.match(/시즌(\d{1,})/i) : season
    let quality = el.title.match(/\d{3,4}p/i)
    let releaseGroup = 'OTHERS'
    if (el.title.search(/next/i) !== -1) {
      releaseGroup = 'NEXT'
    } else if (el.title.search(/once/i) !== -1) {
      releaseGroup = 'Once'
    } else if (el.title.search(/Chaos/i) !== -1) {
      releaseGroup = 'Chaos'
    } else if (el.title.search(/Hel/i) !== -1) {
      releaseGroup = 'Hel'
    }

    el.no = index
    el.title = el.title.replace(/(\.torrent|\.mkv|\.mp4|\.tp|\.ts)/gi, '')
    el.rss_title = el.title.replace(
      /(\.torrent|\.mkv|\.mp4|\.tp|\.ts|360p|720p|1080p)/gi,
      ''
    )
    el.rss_episode = episode === null ? 0 : episode[1]
    el.rss_season = season === null ? 1 : season[1]
    el.rss_quality = quality === null ? '' : quality[0]
    el.rss_release_group = releaseGroup
    el.tid = 0
    el.target = ''
    el.link = linkKey ? el[linkKey] : el.link
    
    let rss_title = el.rss_title.split(/e(\d{2,})/i)[0]
    rss_title = rss_title.replace(/(\d{1,})-(\d{1,})회 합본/, '')
    rss_title = rss_title.replace(/\./, '')

    el.rss_title = rss_title
    ret.push(el)
    index++
  })

  res.json(ret)
})

module.exports = router
