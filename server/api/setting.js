const Router = require('express-promise-router')
const sqlite = require('../../plugins/sqlite')

const router = Router()

router.get('/setting/rss', async (req, res) => {
    sqlite.all("SELECT rowid        rowId\
                     , NAME         name\
                     , URL          url\
                     , SEARCH_KEY   searchKey\
                     , SEARCH_VALUE searchVal\
                     , BOARD_KEY    boardKey\
                     , BOARD_VALUE  boardVal\
                     , PAGE_KEY     pageKey\
                     , PAGE_VALUE   pageVal\
                     , LINK_KEY     linkKey\
                FROM   RSS_LIST"
    , function(err, rows) {
        res.json(rows)
    })
})

router.post('/setting/rss', (req, res) => {
    const { name, url, searchKey, searchVal, boardKey, boardVal, pageKey, pageVal, linkKey } = req.body

    sqlite.run("INSERT INTO RSS_LIST(NAME, URL, SEARCH_KEY, SEARCH_VALUE, BOARD_KEY, BOARD_VALUE, PAGE_KEY, PAGE_VALUE, LINK_KEY)\
                VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)\
                ON CONFLICT(NAME) DO UPDATE SET\
                NAME=excluded.NAME, URL=excluded.URL, SEARCH_KEY=excluded.SEARCH_KEY, SEARCH_VALUE=excluded.SEARCH_VALUE, BOARD_KEY=excluded.BOARD_KEY,\
                BOARD_VALUE=excluded.BOARD_VALUE, PAGE_KEY=excluded.PAGE_KEY, PAGE_VALUE=excluded.PAGE_VALUE, LINK_KEY=excluded.LINK_KEY\
                ", [name, url, searchKey, searchVal, boardKey, boardVal, pageKey, pageVal, linkKey], function(err) {
                    console.log(err)
                    if(err) {
                        res.status(403).json({result: 'fail'})
                    }
                })
    
    res.json({result: 'success'})
})

router.post('/setting/rss/delete', (req, res) => {
    const { name, url, searchKey, searchVal, boardKey, boardVal, pageKey, pageVal } = req.body

    sqlite.run("DELETE FROM RSS_LIST WHERE name = ?\
                ", [name], function(err) {
                    console.log(err)
                    if(err) {
                        res.status(403).json({result: 'fail'})
                    }
                })
    
    res.json({result: 'success'})
})

module.exports = router