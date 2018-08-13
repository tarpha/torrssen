const { Nuxt, Builder } = require('nuxt')
const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const port = process.env.PORT || 3000
const isProd = process.env.NODE_ENV === 'production'
const transmission = require('../plugins/transmission')

const api = require('./api')

// Import API Routes
app.use('/api', api)

// We instantiate Nuxt.js with the options
var config = require('../nuxt.config.js')
config.dev = !isProd

const nuxt = new Nuxt(config)
// Start build process in dev mode
if (config.dev) {
  const builder = new Builder(nuxt)
  builder.build()
}
app.use(nuxt.render)

// Listen the server
server.listen(port, '0.0.0.0')
// console.log('Server listening on localhost:' + port) // eslint-disable-line no-console

// Socket.io
const download = []
let donelist = []
let intervalObj = ''

io.on('connection', (socket) => {
  socket.on('add-download', function (node) {
    download.push({ 'node': node, 'socket': socket })

    if (intervalObj === '') {
      intervalObj = setInterval(intervalFunc, 1000)
    }
  })
})

const intervalFunc = function () {
  if (download.length === 0) {
    clearInterval(intervalObj)
    intervalObj = ''
    donelist.length = []
  }

  download.forEach(el => {
    const getTorrentDetails = (id) => new Promise((resolve, reject) => {
      transmission.get(id, (err, ret) => {
        if (err) reject(err)
        resolve(ret)
      })
    })

    const respond = (result) => {
      if (result.torrents.length > 0) {
        el.socket.emit('send-downloading', result.torrents[0])
      } else {
        if (donelist.indexOf(el) === -1) {
          donelist.push(el)
        }
      }
    }

    const onError = (err) => {
      el.socket.emit('send-error', err.message)
    }

    getTorrentDetails(el.node.id)
      .then(respond)
      .catch(onError)
  })

  donelist.forEach(el => {
    if (download.indexOf(el) !== -1) {
      download.splice(download.indexOf(el), 1)
    }
  })
}
