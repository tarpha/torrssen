<template>
  <div>
    <b-navbar variant="faded" type="light" class="navi" style="padding: 0.5rem 0 0 0;" sticky fixed>
    <div class="container">
      <div class="box">
        <b-alert :show="dismissCountDown"
            dismissible
            variant="info"
            @dismissed="dismissCountDown=0"
            @dismiss-count-down="countDownChanged"
            style="margin-bottom: 0;">
          <h6>Download complete</h6>
          <p class="text-truncate">{{ alertMessage }}</p>
          <b-progress variant="info"
             :max="dismissSecs"
             :value="dismissCountDown"
             height="4px">
          </b-progress>
        </b-alert>
        <div class="zGVn2e">
          <div class="SDkEP">
            <div class="a4bIc">
              <input v-model="searchInput" @keyup.enter="searchTitle" class="gLFyf" maxlength="2048" type="search" title="검색" aria-label="검색" placeholder="Title Search"/>
            </div>
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
    </div>
    </b-navbar>

    <div class="container">
      <nuxt-card
        v-for="(dat, index) in this.data"
        :dat="dat"
        :index="index"
        :key="dat.no">
      </nuxt-card>
      <!-- Paging Component -->
      <b-button
        block variant="link sm"
        @click="next" v-if="showPaging" style="margin-top: 0.4em;">
        결과 더 보기
      </b-button>
      <p class="last text-success" v-if="lastPage">마지막 페이지 입니다</p>
      <div class="loader" v-if="showLoader"></div>
      <!-- Modal Component -->
      <nuxt-modal></nuxt-modal>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from '~/plugins/axios'
import NuxtCard from '~/components/Card.vue'
import NuxtModal from '~/components/Modal.vue'

export default {
  components: {
    NuxtCard,
    NuxtModal
  },
  computed: {
    ...mapGetters([
      'getTorr'
    ])
  },
  watch: {
    'getTorr': {
      handler: function () {
        this.data[this.getTorr.index].tid = this.getTorr.tid
        this.data[this.getTorr.index].target = this.getTorr.target
      },
      deep: true
    }
  },
  data () {
    return {
      search: '',
      paging: {
        offset: 0,
        items: 25
      },
      showLoader: false,
      showPaging: true,
      searchInput: '',
      removeReload: false,
      lastPage: false,
      dismissSecs: 10,
      dismissCountDown: 0,
      alertMessage: ''
    }
  },
  async asyncData ({ app }) {
    const res = await axios.get('/api/rss', {
      params: {
        offset: 0,
        limit: 25
      }
    })

    return { data: res.data }
  },
  methods: {
    countDownChanged (dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    showAlert () {
      this.dismissCountDown = this.dismissSecs
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
}

.remove {
    display: flex;
    flex: 0 0 auto;
    margin: -7px 0;
    align-items: stretch;
    flex-direction: column;
}

.delete_button {
    cursor: pointer;
    font: 27px/25px arial,sans-serif;
    align-items: center;
    padding: 0 0 0 5px;
    border: 0;
    background: transparent;
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

.hide{
  display:none;
}
</style>
