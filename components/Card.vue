<template>
  <div class="card">
    <h5>{{ dat.rss_title !== undefined ? dat.rss_title : 'ERROR' }}</h5>
    <small class="text-success">E{{dat.rss_episode}} {{dat.rss_quality}} {{dat.rss_release_group}}</small>
    <hr/>
    <small class="d-inline-block text-truncate">{{ dat.title !== undefined ? dat.title.trim() : 'error' }}</small>
    <div v-if="dat.tid === 0 || dat.target === 'download'"
      class="d-flex justify-content-between align-items-center">
      <b-link
        :disabled="dat.tid !== 0"
        @click="showModal({
          'no': dat.no,
          'name': dat.title,
          'link': dat.link,
          'index': index,
          'target': 'download',
          'title': 'Transmission'})">
        <small>{{ downloadPath }}</small>
      </b-link>
      <nuxt-delete-button v-if="dat.tid !== 0" :tid="dat.tid" :index="this.index"></nuxt-delete-button>
    </div>
    <div v-if="dat.tid === 0 || dat.target === 'video'"
      class="d-flex justify-content-between align-items-center">
      <b-link
        :disabled="dat.tid !== 0"
        class="d-inline-block text-truncate"
        @click="showModal({
          'no': dat.no,
          'name': dat.title,
          'link': dat.link,
          'path': asTitlePath + dat.rss_title,
          'index': index,
          'target': 'video',
          'title': 'Transmission'})">
        <small>{{ asTitlePath + dat.rss_title }}</small>
      </b-link>
      <nuxt-delete-button v-if="dat.tid !== 0" :tid="dat.tid" :index="this.index"></nuxt-delete-button>
    </div>
    <nuxt-progress
      v-if="dat.tid !== 0"
      :id="dat.tid"
      :name="dat.title"
      :index="this.index">
    </nuxt-progress>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import axios from '~/plugins/axios'
import NuxtProgress from '~/components/Progress'
import NuxtDeleteButton from '~/components/DeleteButton'

export default {
  components: {
    NuxtProgress,
    NuxtDeleteButton
  },
  props: {
    dat: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
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
      downloadPath: process.env.DOWNLOAD,
      asTitlePath: process.env.ASTITLE
    }
  },
  methods: {
    ...mapMutations(['showModal']),
    download: function () {
      axios
        .post('/api/download', this.modal.dat)
        .then(res => {
          const ret = res.data.id !== undefined ? 'success' : 'failure'

          this.modal.id = res.data.id
          this.modal.name = res.data.name
          this.modal.title = 'Download request ' + ret

          if (ret === 'success') {
            for (var i = 0; i < this.data.length; i++) {
              if (this.data[i].no === this.modal.dat.no) {
                this.data[i].tid = res.data.id
                this.data[i].target = this.modal.dat.target
                break
              }
            }

            this.modal.bodyClass = 'hide'
            this.modal.successMark = true
            this.modal.textVariant = 'success'
            setTimeout(() => {
              this.$refs.dnModalRef.hide()
            }, 2000)
          } else {
            this.modal.textVariant = 'danger'
          }
        })
        .catch(err => {
          console.log(err)
          this.modal.textVariant = 'danger'
          this.modal.title = 'Error'
          this.modal.name = err.message
        })
    },
    deleteDown: function (id) {
      console.log('delete')
      axios
        .post('/api/delete', { id: id })
        .then(res => {
          for (var i = 0; i < this.data.length; i++) {
            if (this.data[i].tid === id) {
              this.data[i].tid = 0
              this.data[i].done = 0
              this.data[i].target = ''
              break
            }
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style scoped>
.card {
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  border-radius: 8px;
  margin-top: 0.4em;
  padding: 1rem;
}

.card:hover {
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
}
</style>
