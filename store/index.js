import Vuex from 'vuex'

const store = () => new Vuex.Store({
  state: {
    modal: {
      show: false,
      data: {},
      textVariant: '',
      showBody: true,
      successMark: false
    },
    torr: {
      index: 0,
      tid: 0,
      target: ''
    },
    alert: {
      message: '',
      dismissSecs: 10,
      dismissCountDown: 0,
      variant: 'danger',
      title: ''
    },
    searchInput: ''
  },
  getters: {
    getTorr: state => state.torr,
    getAlertCount: state => state.alert.dismissCountDown,
    getSearchInput: state => state.searchInput,
    getModalName: state => state.modal.data.name === undefined ? '' : state.modal.data.name.trim(),
    getModalPath: state => state.modal.data.path === undefined ? process.env.DOWNLOAD : state.modal.data.path
  },
  mutations: {
    setSearchInput (state, searchInput) {
      state.searchInput = searchInput
    },
    setAlertCountDown (state, dismissCountDown) {
      state.alert.dismissCountDown = dismissCountDown
    },
    setAlert (state, alert) {
      state.alert.variant = alert.variant
      state.alert.title = alert.title
    },
    showAlert (state, message) {
      state.alert.message = message
      state.alert.dismissCountDown = state.alert.dismissSecs
    },
    setTorr (state, torr) {
      state.torr.tid = torr.tid
      state.torr.target = torr.target
      state.torr.index = torr.index
    },
    showModal (state, data) {
      state.modal.show = true
      state.modal.data = data
      state.modal.showBody = true
      state.modal.textVariant = ''
      state.modal.showBody = true
      state.modal.successMark = false
    },
    hideModal (state) {
      state.modal.show = false
      state.modal.data = {}
    }
  }
})

export default store
