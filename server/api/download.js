const { Router } = require('express')
const transmission = require('../../plugins/transmission')

const router = Router()

router.post('/download', (req, res) => {
  const { link, path } = req.body
  const options = path === undefined ? {} : { 'download-dir': path }

  const getDownload = () =>
    new Promise((resolve, reject) => {
      transmission.addUrl(link, options, (err, ret) => {
        if (err) reject(err)
        resolve(ret)
      })
    })

  // respond the token
  const respond = ret => {
    res.json(ret)
  }

  // error occured
  const onError = err => {
    res.status(403).json(err)
  }

  getDownload()
    .then(respond)
    .catch(onError)
})

router.post('/delete', (req, res) => {
  const { id } = req.body
  const option = true

  const deleteDownload = () =>
    new Promise((resolve, reject) => {
      transmission.delete(id, option, (err, ret) => {
        if (err) reject(err)
        resolve(ret)
      })
    })

  // respond the token
  const respond = ret => {
    res.json(ret)
  }

  // error occured
  const onError = err => {
    res.status(403).json(err)
  }

  deleteDownload()
    .then(respond)
    .catch(onError)
})

module.exports = router
