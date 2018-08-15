<template>
  <b-navbar variant="faded" type="light" class="navi" style="padding: 0.5rem 0 0 0;" sticky fixed>
    <div class="container">
      <div class="box">
        <nuxt-alert></nuxt-alert>
        <div class="zGVn2e">
          <div class="SDkEP">
            <div class="a4bIc">
              <input v-model="searchInput" @keyup.enter="setSearchInput(searchInput)" class="gLFyf" maxlength="2048" type="search" title="검색" aria-label="검색" placeholder="Title Search"/>
            </div>
            <div v-if="searchInput != ''" class="remove">
              <button class="clear_button" type="button" @click="remove">
                <span>×</span>
              </button>
            </div>
          </div>
          <button :class="bottonClass" type="button" @click="setSearchInput(searchInput)">
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
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import NuxtAlert from '~/components/Alert.vue'

export default {
  components: {
    NuxtAlert
  },
  data () {
    return {
      searchInput: '',
      bottonClass: 'search-button'
    }
  },
  methods: {
    ...mapMutations([
      'setSearchInput'
    ]),
    remove: function () {
      this.searchInput = ''
      this.setSearchInput('')
    }
  },
  computed: {
    ...mapGetters([
      'getAlertCount'
    ])
  },
  watch: {
    'getAlertCount': {
      handler: function () {
        if (this.getAlertCount === 0) {
          this.bottonClass = 'search-button'
        } else {
          this.bottonClass = 'search-button no-top-right-radius'
        }
      },
      deep: true
    }
  }
}
</script>

<style scoped>
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

.search-button {
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
    box-shadow: 0 1px 6px rgba(32, 33, 36, 0.28);
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

.no-top-right-radius {
    -webkit-border-top-right-radius: 0;
}
</style>
