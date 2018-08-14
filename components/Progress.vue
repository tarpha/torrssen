<template>
  <b-progress :value="done" :max="max" show-progress animated></b-progress>
</template>

<script>
import { mapMutations } from 'vuex'
import socket from '~/plugins/socket.io.js'

export default {
  props: {
    id: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      max: 100,
      done: 0,
      intervalObj: ''
    }
  },
  beforeMount () {
    socket.on('send-downloading-' + this.id, (node) => {
      this.done = node.percentDone * 100
    })
    socket.on('send-error-' + this.id, (err) => {
      console.log(err)
    })
    socket.on('send-done-' + this.id, (ret) => {
      if (this.intervalObj !== '') {
        clearInterval(this.intervalObj)
        this.setTorr({
          'tid': 0,
          'target': '',
          'index': this.index
        })
        this.showAlert(this.name.trim())
      }
    })
  },
  mounted () {
    this.$nextTick(() => {
      this.intervalObj = setInterval(() => {
        socket.emit('check-download', this.id)
      }, 1000)
    })
  },
  methods: {
    ...mapMutations([
      'showAlert',
      'setTorr'
    ])
  }
}
</script>

<style scoped>
</style>
