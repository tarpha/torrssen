var sqlite3 = require('sqlite3').verbose()
var sqlite = new sqlite3.Database('./property.sqlite')

sqlite.serialize(function() {
  sqlite.run("CREATE TABLE IF NOT EXISTS RSS_LIST (\
      NAME TEXT,\
      URL TEXT,\
      SEARCH_KEY TEXT,\
      SEARCH_VALUE TEXT,\
      BOARD_KEY TEXT,\
      BOARD_VALUE TEXT,\
      PAGE_KEY TEXT,\
      PAGE_VALUE INTEGER,\
      LINK_KEY TEXT, \
      PRIMARY KEY(\"NAME\")\
  )")
})

module.exports = {
  all: (query, callback) => sqlite.all(query, callback),
  run: (query, callback) => sqlite.run(query, callback)
}