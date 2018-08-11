<template>
  <div>
    <b-navbar variant="faded" type="light" class="container navi" sticky fixed>
      <div class="box">
        <div class="zGVn2e">
          <div class="SDkEP">
            <div class="a4bIc">
              <input v-model="searchInput" @keyup.enter="searchTitle" class="gLFyf" maxlength="2048" type="search" title="검색" aria-label="검색" placeholder="Title Search"></div>
              <div v-if="searchInput != ''" class="remove">
                <button class="clear_button" type="button" @click="remove">
                  <span aria-label="검색어 지우기">×</span>
                </button>
              </div>
            </div>
            <button class="Tg7LZd" aria-label="Google 검색" type="button" @click="searchTitle">
              <div class="gBCQ5d">
                <span class="z1asCe MZy1Rb">
                  <svg focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
                  </svg>
                </span>
              </div>
            </button>
          </div>
      </div>
    </b-navbar>
    <div class="container">
      <div class="card" v-for="dat in data" :key="dat.no" >
        <h5>{{ dat.rss_title }}</h5>
        <small class="text-success">E{{dat.rss_episode}} {{dat.rss_quality}} {{dat.rss_release_group}}</small>
        <hr/>
        <b-progress v-if="progress" :value="counter" :max="max" show-progress animated></b-progress>
        <small class="d-inline-block text-truncate">{{ dat.title }}</small>
        <b-link
          href=""
          @click="showModal({'name': dat.title, 'link': dat.link})">
          <small>/download</small>
        </b-link>
        <b-link
          class="d-inline-block text-truncate"
          href=""
          @click="showModal({'name': dat.title, 'link': dat.link, 'path': dat.rss_title})">
          <small>/video/TV/{{ dat.rss_title }}</small>
        </b-link>
      </div>
      <!-- Paging Component -->
      <b-button
        block variant="link sm"
        @click="next" v-if="showPaging" style="margin-top: 0.4em;">
        결과 더 보기
      </b-button>
      <p class="last text-success" v-if="lastPage">마지막 페이지 입니다</p>
      <div class="loader" v-if="showLoader"></div>
      <!-- Modal Component -->
      <b-modal
        ref="dnModalRef"
        :title="this.modal.title"
        :header-text-variant="this.modal.textVariant"
        class="d-inline-block"
        hide-footer>
        <div :class="this.modal.bodyClass">
          <h6 class="my-4 text-truncate">{{modal.name.trim()}}</h6>
          <p class="text-success text-truncate">{{modal.path == undefined ? '/download' : modal.path}}</p>
        </div>
        <div v-if="modal.successMark">
          <div class="check_mark">
            <div class="sa-icon sa-success animate">
              <span class="sa-line sa-tip animateSuccessTip"></span>
              <span class="sa-line sa-long animateSuccessLong"></span>
              <div class="sa-placeholder"></div>
              <div class="sa-fix"></div>
            </div>
          </div>
        </div>
        <div :class="this.modal.bodyClass">
          <hr/>
          <b-button block variant="link" @click="download()">Download Request</b-button>
        </div>
      </b-modal>

    </div>
  </div>
</template>

<script>
import qs from 'qs'
import axios from '~/plugins/axios'

export default {
  data () {
    return {
      search: '',
      paging: {
        offset: 0,
        items: 25
      },
      modal: {
        name: '',
        path: '',
        id: '',
        title: '',
        textVariant: '',
        bodyClass: '',
        successMark: '',
        dat: {}
      },
      showLoader: false,
      showPaging: true,
      searchInput: '',
      counter: 45,
      max: 100,
      progress: false,
      removeReload: false,
      lastPage: false
    }
  },
  async asyncData ({ app }) {
    // const res = await axios.get('http://10.0.1.10:8080/torrss/getRSSList.php?offset=0&limit=25')
    const res = await axios.get('/api/rss', {
      params: {
        offset: 0,
        limit: 25
      }
    })
    return { data: res.data }
  },
  methods: {
    showModal: function (dat, event) {
      this.modal.title = 'Transmission'
      this.modal.dat = dat
      this.modal.name = dat.name
      this.modal.textVariant = ''
      this.modal.bodyClass = ''
      this.modal.successMark = false
      this.modal.path = dat.path === undefined ? undefined : '/video/TV/' + dat.path

      this.$refs.dnModalRef.show()
    },
    download: function () {
      const data = qs.stringify(this.modal.dat)

      axios.post('http://10.0.1.10:8080/torrss/putRSSDownload.php', data)
        .then(res => {
          this.modal.id = res.data.arguments.torrent_added.id
          this.modal.name = res.data.arguments.torrent_added.name
          this.modal.title = 'Download request ' + res.data.result

          if (res.data.result === 'success') {
            this.modal.bodyClass = 'hide'
            this.modal.successMark = true
            this.modal.textVariant = 'success'
            setTimeout(() => { this.$refs.dnModalRef.hide() }, 2000)
          } else {
            this.modal.textVariant = 'danger'
          }
        })
        .catch((error) => {
          this.modal.textVariant = 'danger'
          this.modal.title = error
        })
    },
    next: function () {
      this.showPaging = false
      this.showLoader = true
      this.paging.offset += this.paging.items
      // axios.get('http://10.0.1.10:8080/torrss/getRSSList.php?offset=' + this.paging.offset + '&limit=' + this.paging.items + '&search=' + this.searchInput)
      axios.get('/api/rss', {
        params: {
          offset: this.paging.offset,
          limit: this.paging.items,
          title: this.searchInput
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
        }).catch((error) => { alert(error) })
    },
    remove: function () {
      this.searchInput = ''

      if (this.removeReload) {
        // axios.get('http://10.0.1.10:8080/torrss/getRSSList.php?offset=0&limit=25')
        axios.get('/api/rss', {
          params: {
            offset: 0,
            limit: 25
          }
        })
          .then(res => {
            this.data = res.data

            window.scroll({ top: 0, left: 0, behavior: 'auto' })

            this.showPaging = true
            this.lastPage = false
            this.showLoader = false
            this.removeReload = false
          }).catch((error) => { alert(error) })
      }
    },
    searchTitle: function () {
      if (this.searchInput !== '') {
        this.removeReload = true
      } else {
        this.removeReload = false
      }

      this.showPaging = true
      this.lastPage = false
      this.showLoader = false

      // axios.get('http://10.0.1.10:8080/torrss/getRSSList.php?offset=0&limit=25&search=' + encodeURI(this.searchInput))
      axios.get('/api/rss', {
        params: {
          offset: 0,
          limit: this.paging.items,
          title: this.searchInput
        }
      })
        .then(res => {
          this.data = res.data
          window.scroll({ top: 0, left: 0, behavior: 'auto' })
        }).catch((error) => { alert(error) })
    }
  },
  mounted () {
    // this.scroll(this.data)
  },
  computed: {
    filteredList: function () {
      return this.data.filter(dat => {
        return dat.title.toLowerCase().includes(this.search.toLowerCase())
      })
    }
  }
}
</script>

<style scoped>
.card {
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.2);
    transition: 0.3s;
    border-radius: 8px;
    margin-top: 0.4em;
    padding: 1rem;
}

.card:hover {
    box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
}

.navi {
    margin-left: auto;
    margin-right: auto;
    background-color: #FFFFFF;
}

.box {
    width: 100%;
    background-color: #fff;
    box-shadow: 0 1px 6px rgba(32, 33, 36, 0.28);
    border-radius: 8px;
}

.last {
    margin-top: 1em;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
}

/* google */
.zGVn2e {
    display: flex;
    height: 39px;
    z-index: 3;
}

.SDkEP {
    flex: 1;
    display: flex;
    padding: 7px 0;
}

.a4bIc {
    display: flex;
    flex: 1;
}

.gLFyf {
    line-height: 25px;
    background-color: transparent;
    border: none;
    margin: 0;
    padding: 0 0 0 16px;
    font-size: 16px;
    color: rgba(0,0,0,.87);
    word-wrap: break-word;
    outline: none;
    display: flex;
    flex: 1;
    -webkit-tap-highlight-color: transparent;
    width: 100%;
}

.remove {
    display: flex;
    flex: 0 0 auto;
    margin: -7px 0;
    align-items: stretch;
    flex-direction: column;
}

.clear_button {
    display: flex;
    flex: 1;
    color: #757575;
    cursor: pointer;
    font: 27px/25px arial,sans-serif;
    align-items: center;
    padding: 0 15px 0 5px;
    border: 0;
    background: transparent;
}

.Tg7LZd {
    align-items: flex-start;
    border-radius: 0;
    -webkit-border-top-right-radius: 8px;
    -webkit-border-bottom-right-radius: 8px;
    height: 40px;
    width: 40px;
    background-color: #3b78e7;
    border: 1px solid #3367d6;
    flex: 0 0 auto;
    padding: 0;
}

.gBCQ5d {
    background: none;
    color: #fff;
    height: 24px;
    width: 24px;
    margin: auto;
}

.z1asCe, .qa__svg-icon {
    display: inline-block;
    fill: currentColor;
    height: 24px;
    line-height: 24px;
    position: relative;
    width: 24px;
}

/* loader */
.loader {
    border: 2px solid #f3f3f3; /* Light grey */
    border-top: 2px solid #3498db; /* Blue */
    border-radius: 50%;
    width: 1.5em;
    height: 1.5em;
    animation: spin 1s linear infinite;
    margin-top: 1rem;
    margin-left: auto;
    margin-right: auto;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* success animation*/
.check_mark {
  width: 80px;
  height: 130px;
  margin: 0 auto;
}

.hide{
  display:none;
}

.sa-icon {
  width: 80px;
  height: 80px;
  border: 4px solid gray;
  -webkit-border-radius: 40px;
  border-radius: 40px;
  border-radius: 50%;
  margin: 20px auto;
  padding: 0;
  position: relative;
  box-sizing: content-box;
}

.sa-icon.sa-success {
  border-color: #4CAF50;
}

.sa-icon.sa-success::before, .sa-icon.sa-success::after {
  content: '';
  -webkit-border-radius: 40px;
  border-radius: 40px;
  border-radius: 50%;
  position: absolute;
  width: 60px;
  height: 120px;
  background: white;
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
}

.sa-icon.sa-success::before {
  -webkit-border-radius: 120px 0 0 120px;
  border-radius: 120px 0 0 120px;
  top: -7px;
  left: -33px;
  -webkit-transform: rotate(-45deg);
  transform: rotate(-45deg);
  -webkit-transform-origin: 60px 60px;
  transform-origin: 60px 60px;
}

.sa-icon.sa-success::after {
  -webkit-border-radius: 0 120px 120px 0;
  border-radius: 0 120px 120px 0;
  top: -11px;
  left: 30px;
  -webkit-transform: rotate(-45deg);
  transform: rotate(-45deg);
  -webkit-transform-origin: 0px 60px;
  transform-origin: 0px 60px;
}

.sa-icon.sa-success .sa-placeholder {
  width: 80px;
  height: 80px;
  border: 4px solid rgba(76, 175, 80, .5);
  -webkit-border-radius: 40px;
  border-radius: 40px;
  border-radius: 50%;
  box-sizing: content-box;
  position: absolute;
  left: -4px;
  top: -4px;
  z-index: 2;
}

.sa-icon.sa-success .sa-fix {
  width: 5px;
  height: 90px;
  background-color: white;
  position: absolute;
  left: 28px;
  top: 8px;
  z-index: 1;
  -webkit-transform: rotate(-45deg);
  transform: rotate(-45deg);
}

.sa-icon.sa-success.animate::after {
  -webkit-animation: rotatePlaceholder 4.25s ease-in;
  animation: rotatePlaceholder 4.25s ease-in;
}

.sa-icon.sa-success {
  border-color: transparent\9;
}
.sa-icon.sa-success .sa-line.sa-tip {
  -ms-transform: rotate(45deg) \9;
}
.sa-icon.sa-success .sa-line.sa-long {
  -ms-transform: rotate(-45deg) \9;
}

.animateSuccessTip {
  -webkit-animation: animateSuccessTip 0.75s;
  animation: animateSuccessTip 0.75s;
}

.animateSuccessLong {
  -webkit-animation: animateSuccessLong 0.75s;
  animation: animateSuccessLong 0.75s;
}

@-webkit-keyframes animateSuccessLong {
  0% {
    width: 0;
    right: 46px;
    top: 54px;
  }
  65% {
    width: 0;
    right: 46px;
    top: 54px;
  }
  84% {
    width: 55px;
    right: 0px;
    top: 35px;
  }
  100% {
    width: 47px;
    right: 8px;
    top: 38px;
  }
}
@-webkit-keyframes animateSuccessTip {
  0% {
    width: 0;
    left: 1px;
    top: 19px;
  }
  54% {
    width: 0;
    left: 1px;
    top: 19px;
  }
  70% {
    width: 50px;
    left: -8px;
    top: 37px;
  }
  84% {
    width: 17px;
    left: 21px;
    top: 48px;
  }
  100% {
    width: 25px;
    left: 14px;
    top: 45px;
  }
}
@keyframes animateSuccessTip {
  0% {
    width: 0;
    left: 1px;
    top: 19px;
  }
  54% {
    width: 0;
    left: 1px;
    top: 19px;
  }
  70% {
    width: 50px;
    left: -8px;
    top: 37px;
  }
  84% {
    width: 17px;
    left: 21px;
    top: 48px;
  }
  100% {
    width: 25px;
    left: 14px;
    top: 45px;
  }
}

@keyframes animateSuccessLong {
  0% {
    width: 0;
    right: 46px;
    top: 54px;
  }
  65% {
    width: 0;
    right: 46px;
    top: 54px;
  }
  84% {
    width: 55px;
    right: 0px;
    top: 35px;
  }
  100% {
    width: 47px;
    right: 8px;
    top: 38px;
  }
}

.sa-icon.sa-success .sa-line {
  height: 5px;
  background-color: #4CAF50;
  display: block;
  border-radius: 2px;
  position: absolute;
  z-index: 2;
}

.sa-icon.sa-success .sa-line.sa-tip {
  width: 25px;
  left: 14px;
  top: 46px;
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
}

.sa-icon.sa-success .sa-line.sa-long {
  width: 47px;
  right: 8px;
  top: 38px;
  -webkit-transform: rotate(-45deg);
  transform: rotate(-45deg);
}

@-webkit-keyframes rotatePlaceholder {
  0% {
    transform: rotate(-45deg);
    -webkit-transform: rotate(-45deg);
  }
  5% {
    transform: rotate(-45deg);
    -webkit-transform: rotate(-45deg);
  }
  12% {
    transform: rotate(-405deg);
    -webkit-transform: rotate(-405deg);
  }
  100% {
    transform: rotate(-405deg);
    -webkit-transform: rotate(-405deg);
  }
}
@keyframes rotatePlaceholder {
  0% {
    transform: rotate(-45deg);
    -webkit-transform: rotate(-45deg);
  }
  5% {
    transform: rotate(-45deg);
    -webkit-transform: rotate(-45deg);
  }
  12% {
    transform: rotate(-405deg);
    -webkit-transform: rotate(-405deg);
  }
  100% {
    transform: rotate(-405deg);
    -webkit-transform: rotate(-405deg);
  }
}
</style>
