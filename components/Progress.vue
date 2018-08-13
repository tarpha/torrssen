<template>
  <b-progress :value="done" :max="max" show-progress animated></b-progress>
</template>

<script>
import socket from '~/plugins/socket.io.js'

export default {
  props: {
    id: {
      type: Number,
      required: true
    },
    index: {
      type: String,
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
      }
      console.log(ret)
    })
  },
  mounted () {
    this.$nextTick(() => {
      this.intervalObj = setInterval(() => {
        socket.emit('check-download', this.id)
      }, 1000)
    })
  }
}
</script>

<style scoped>
</style>
