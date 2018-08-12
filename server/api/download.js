const { Router } = require('express')
const transmission = require('../../plugins/transmission')

const router = Router()

router.post('/download', (req, res) => {
  const { link, path } = req.body
  const options = path === undefined ? {} : { 'download-dir': '/video/TV/' + path }

  const getDownload = () => new Promise((resolve, reject) => {
    transmission.addUrl(link, options, (err, arg) => {
      if (err) reject(err)
      resolve(arg)
    })
  })

  // respond the token
  const respond = (ret) => {
    res.json(ret)
  }

  // error occured
  const onError = (err) => {
    res.status(403).json(err)
  }

  getDownload()
    .then(respond)
    .catch(onError)
})

module.exports = router
