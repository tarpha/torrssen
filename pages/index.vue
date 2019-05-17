<template>
  <div>
    <!-- full loader -->
    <div v-if="PageLoadingShow" class="loading">Loading&#8230;</div>
    <!-- Navbar Component -->
    <nuxt-navbar></nuxt-navbar>
    
     <div class="container">
    <b-button-group>
      <b-button variant="link" 
        v-if="this.showDBBtn" 
        @click="showDB">DB</b-button>
      <b-button variant="link" 
        v-for="(rss, index) in this.rssList" 
        :key="`dyn-tab-${index}`"
        @click="showRSS(rss)">{{rss.name}}</b-button>
    </b-button-group>
    </div>
    <div :class="PageLoadingClass">
      <div class="container">
        <!-- Card Component -->
        <nuxt-card
          v-for="(dat, index) in this.data"
          :dat="dat"
          :index="index"
          :key="dat.no">
        </nuxt-card>
        <!-- Paging Component -->
        <div class="paging">
          <div>
            <b-button
              style="padding-top: 0.7em"
              block variant="link sm"
              @click="next" v-if="showPaging">
              결과 더 보기
            </b-button>
            <div style="padding-top: 0.7em" v-if="lastPage">
              <p class="last text-success">마지막 페이지 입니다</p>
            </div>
          </div>
          <div class="loader" v-if="showLoader">
            <svg class="circular" viewBox="25 25 50 50">
              <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"/>
            </svg>
          </div>
        </div>   
      </div>
    </div>
    <!-- Modal Component -->
    <nuxt-modal></nuxt-modal>
    <div class="footer">
      <div style="text-align: right;">
        <small>
          &copy; 2018 TRPE |&nbsp;
        </small>
      </div>
      <div>
        <a href="https://github.com/tarpha/torrssen" target="_blank" style="color: black; text-decoration: none;">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          <small>
            GitHub
          </small>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from '~/plugins/axios'
import NuxtCard from '~/components/Card'
import NuxtModal from '~/components/Modal'
import NuxtNavbar from '~/components/Navbar'

// const rssApiUrl = '/api/rss' + (process.env.READER === 'RSS' ? '/php' : '')
let rssApiUrl = '/api/rss'

export default {
  components: {
    NuxtCard,
    NuxtModal,
    NuxtNavbar
  },
  computed: {
    ...mapGetters(['getTorr', 'getSearchInput'])
  },
  watch: {
    getTorr: {
      handler: function () {
        this.data[this.getTorr.index].tid = this.getTorr.tid
        this.data[this.getTorr.index].target = this.getTorr.target
      },
      deep: true
    },
    getSearchInput: {
      handler: function () {
        this.showPaging = true
        this.lastPage = false
        this.showLoader = false

        this.PageLoadingShow = true

        this.PageLoadingClass = 'blur-filter'
        this.PageLoadingShow = true

        axios
          .get(rssApiUrl, {
            params: {
              offset: 0,
              limit: this.paging.items,
              title: this.getSearchInput,
              rss: this.curRss
            }
          })
          .then(res => {
            this.data = res.data
            this.PageLoadingClass = ''
            this.PageLoadingShow = false
            window.scroll({ top: 0, left: 0, behavior: 'auto' })
          })
          .catch(error => {
            alert(error)
          })
      }
    }
  },
  data () {
    return {
      paging: {
        offset: 0,
        items: 25
      },
      showLoader: false,
      showPaging: true,
      lastPage: false,
      PageLoadingClass: '',
      PageLoadingShow: false,
      showDBBtn: process.env.READER === 'DB'
    }
  },
  async asyncData ({ app }) {
    const resRss = await axios.get('/api/setting/rss', {})
    if( process.env.READER !== 'DB' && resRss.data) {
      rssApiUrl = '/api/rss/url'
    }
    const res = await axios.get(rssApiUrl, {
      params: {
        offset: 0,
        limit: 25,
        rss: resRss.data[0]
      }
    })
    return { 
      data: res.data,
      rssList: resRss.data,
      curRss: resRss.data[0]
    }
  },
  methods: {
    next: function () {
      this.showPaging = false
      this.showLoader = true
      this.paging.offset += this.paging.items

      axios
        .get(rssApiUrl, {
          params: {
            offset: this.paging.offset,
            limit: this.paging.items,
            title: this.getSearchInput,
            rss: this.curRss
          }
        })
        .then(res => {
          if (res.data.length === 0) {
            this.lastPage = true
            this.showLoader = false
          } else {
            setTimeout(() => {
              res.data.forEach(el => {
                this.data.push(el)
              })
              this.showPaging = true
              this.lastPage = false
              this.showLoader = false
            }, 1000)
          }
        })
        .catch(error => {
          alert(error)
        })
    },
    showDB: function () {
      rssApiUrl = '/api/rss'
      this.showPaging = true
      this.lastPage = false
      this.showLoader = false

      this.PageLoadingShow = true

      this.PageLoadingClass = 'blur-filter'
      this.PageLoadingShow = true

      axios
        .get(rssApiUrl, {
          params: {
            offset: 0,
            limit: this.paging.items,
            title: this.getSearchInput,
            rss: this.curRss
          }
        })
        .then(res => {
          this.data = res.data
          this.PageLoadingClass = ''
          this.PageLoadingShow = false
          window.scroll({ top: 0, left: 0, behavior: 'auto' })
        })
        .catch(error => {
          alert(error)
        })
    },
    showRSS: function (rss) {
      rssApiUrl = '/api/rss/url'
      this.curRss = rss

      this.showPaging = true
      this.lastPage = false
      this.showLoader = false

      this.PageLoadingShow = true

      this.PageLoadingClass = 'blur-filter'
      this.PageLoadingShow = true

      axios
        .get(rssApiUrl, {
          params: {
            offset: 0,
            limit: this.paging.items,
            title: this.getSearchInput,
            rss: encodeURI(JSON.stringify(this.curRss))
          }
        })
        .then(res => {
          this.data = res.data
          this.PageLoadingClass = ''
          this.PageLoadingShow = false
          window.scroll({ top: 0, left: 0, behavior: 'auto' })
        })
        .catch(error => {
          alert(error)
        })
    }
  }
}
</script>

<style  lang="scss" scoped>
.paging {
  height: 1.5em;
}

.footer {
  background: rgba(0, 0, 0, 0.1);
  width: 100%;
  min-height: 4em;
  padding-top: 1em;
  display: -webkit-flex;
  -webkit-justify-content: center;
  display: flex;
  justify-content: center;
}

.footer div {
  -webkit-flex: 1;
  flex: 1;
}

.bottom-img {
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.last {
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}

/* loader */
$green: #008744;
$blue: #0057e7;
$red: #d62d20;
$yellow: #ffa700;
$white: #eee;

// scaling... any units
$width: 30px;

body {
  background-color: $white;
}

// end demo-specific

.loader {
  position: relative;
  padding-top: 1em;
  margin: 0 auto;
  width: $width;
  &:before {
    content: '';
    display: block;
    padding-top: 100%;
  }
}

.circular {
  animation: rotate 2s linear infinite;
  height: 100%;
  transform-origin: center center;
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}

.path {
  stroke-dasharray: 1, 200;
  stroke-dashoffset: 0;
  animation: dash 1.5s ease-in-out infinite, color 6s ease-in-out infinite;
  stroke-linecap: round;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -35px;
  }
  100% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -124px;
  }
}

@keyframes color {
  100%,
  0% {
    stroke: $red;
  }
  40% {
    stroke: $blue;
  }
  66% {
    stroke: $green;
  }
  80%,
  90% {
    stroke: $yellow;
  }
}

/* Absolute Center Spinner */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.blur-filter {
  -webkit-filter: blur(3px);
  -moz-filter: blur(3px);
  -o-filter: blur(3px);
  -ms-filter: blur(3px);
  filter: blur(3px);
}

.loading {
  position: fixed;
  z-index: 999;
  height: 2em;
  width: 2em;
  overflow: show;
  margin: auto;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}

/* Transparent Overlay */
.loading:before {
  content: '';
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.3);
}

/* :not(:required) hides these rules from IE9 and below */
.loading:not(:required) {
  /* hide "loading..." text */
  font: 0/0 a;
  color: transparent;
  text-shadow: none;
  background-color: transparent;
  border: 0;
}

.loading:not(:required):after {
  content: '';
  display: block;
  font-size: 10px;
  width: 1em;
  height: 1em;
  margin-top: -0.5em;
  -webkit-animation: spin 1.5s linear infinite;
  animation: spin 1.5s linear infinite;
  border-radius: 0.5em;
  -webkit-box-shadow: rgba(0, 0, 0, 0.5) 1.5em 0 0 0,
    rgba(0, 0, 0, 0.5) 1.1em 1.1em 0 0, rgba(0, 0, 0, 0.5) 0 1.5em 0 0,
    rgba(0, 0, 0, 0.5) -1.1em 1.1em 0 0, rgba(0, 0, 0, 0.5) -1.5em 0 0 0,
    rgba(0, 0, 0, 0.5) -1.1em -1.1em 0 0, rgba(0, 0, 0, 0.5) 0 -1.5em 0 0,
    rgba(0, 0, 0, 0.5) 1.1em -1.1em 0 0;
  box-shadow: rgba(0, 0, 0, 0.5) 1.5em 0 0 0, rgba(0, 0, 0, 0.5) 1.1em 1.1em 0 0,
    rgba(0, 0, 0, 0.5) 0 1.5em 0 0, rgba(0, 0, 0, 0.5) -1.1em 1.1em 0 0,
    rgba(0, 0, 0, 0.5) -1.5em 0 0 0, rgba(0, 0, 0, 0.5) -1.1em -1.1em 0 0,
    rgba(0, 0, 0, 0.5) 0 -1.5em 0 0, rgba(0, 0, 0, 0.5) 1.1em -1.1em 0 0;
}
</style>
