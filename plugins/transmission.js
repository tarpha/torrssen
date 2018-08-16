require('dotenv').config()

const Transmission = require('transmission')

const transmission = (process.env.TMUSER)
  ? new Transmission({
    'host': process.env.TMHOST,
    'port': process.env.TMPORT,
    'username': process.env.TMUSER,
    'password': process.env.TMPASSWORD
  })
  : new Transmission({
    'host': process.env.TMHOST,
    'port': process.env.TMPORT
  })

module.exports = {
  addUrl: (url, options, callback) => transmission.addUrl(url, options, callback),
  get: (id, collback) => transmission.get(id, collback),
  delete: (id, option, collback) => transmission.remove(id, option, collback)
}
