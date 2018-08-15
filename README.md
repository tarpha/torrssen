# torrssen

> RSS \+ [Transmission](https://transmissionbt.com/) \+ [PostgreSQL](https://www.postgresql.org/) \+ [Nuxt.js](https://nuxtjs.org/) project

This is Web UI which can output RSS list stored in DB and send the download request by Transmission

Optimized for iPhone screen size

## Env Setup

install [Node.js](https://nodejs.org)

install [yarn](https://yarnpkg.com) (optional. but recommanded)

Rename and fill *env-default-rename-to.env* file to .env

### Reader Setup

option 1. DB

    Set READER env variable to DB (inside .env file)

    Generated **RSS** table as `sql/ddl/rrs.sql`

option 2. Url
 
    Set READER env variable to RSS (inside .env file)
    
    Set RSSURL env variable to {site url}

## Build Setup

    # install dependencies
    $ npm install # Or yarn
    
    # serve with hot reload at localhost:3000
    $ npm run dev # Or yarn dev
    
    # build for production
    $ npm run build # Or yarn build
    
    # launch server (after build)
    $ npm start # Or yarn start

For detailed explanation on how things work, checkout the [Nuxt.js docs](https://github.com/nuxt/nuxt.js).
