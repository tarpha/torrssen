require('dotenv').config()

module.exports = {
  env: {
    baseUrl: 'http://localhost:' + (pocess.env.PORT || 3000)
    DOWNLOAD: process.env.DOWNLOAD || '/download',
    ASTITLE: process.env.ASTITLE || '/video/TV/',
    READER: process.env.READER || 'DB'
  },
  /*
  ** Headers of the page
  */
  head: {
    title: 'torRSS by E+N',
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, viewport-fit=cover'
      },
      { hid: 'description', name: 'description', content: 'torRSS.js project' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
  ** Global CSS
  */
  css: ['~/assets/css/main.css'],
  /*
  ** Add axios globally
  */
  build: {
    vendor: ['axios'],
    /*
    ** Run ESLINT on save
    */
    extend (config, ctx) {
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  /*
  ** modules
  */
  modules: ['bootstrap-vue/nuxt', '@nuxtjs/dotenv']
}
