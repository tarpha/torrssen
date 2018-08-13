import Vuex from 'vuex'

const store = () => new Vuex.Store({
  state: {
    modal: {
      show: false,
      data: {},
      textVariant: '',
      bodyClass: '',
      successMark: false
    },
    torr: {
      index: 0,
      tid: 0,
      target: ''
    }
  },
  getters: {
    getTorr: state => state.torr,
    getTid: state => state.torr.tid,
    getInx: state => state.torr.index
  },
  mutations: {
    setTorr (state, torr) {
      state.torr.tid = torr.tid
      state.torr.target = torr.target
      state.torr.index = torr.index
    },
    showModal (state, data) {
      state.modal.show = true
      state.modal.data = data
    },
    hideModal (state) {
      state.modal.show = false
      state.modal.data = {}
      state.modal.textVariant = ''
      state.modal.bodyClass = ''
      state.modal.successMark = ''
    }
  }
})

export default store
