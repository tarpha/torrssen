<template>
  <button class="delete_button text-danger" type="button" @click="deleteDown">
    <span aria-label="다운로드 삭제">×</span>
  </button>
</template>

<script>
import { mapMutations } from 'vuex'
import axios from '~/plugins/axios'

export default {
  props: {
    tid: {
      type: Number,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },
  methods: {
    ...mapMutations([
      'setTorr',
      'setAlert'
    ]),
    deleteDown: function () {
      axios.post('/api/delete', { 'id': this.tid })
        .then(res => {
          this.setTorr({
            'tid': 0,
            'target': '',
            'index': this.index
          })
          this.setAlert({ 'variant': 'danger', 'title': 'Stop and Delete' })
        })
        .catch((err) => {
          alert(err)
        })
    }
  }
}
</script>

<style scoped>
.delete_button {
    cursor: pointer;
    font: 27px/25px arial,sans-serif;
    align-items: center;
    padding: 0 0 0 5px;
    border: 0;
    background: transparent;
}
</style>
