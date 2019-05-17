<template>
  <div>
    <b-card no-body>
      <b-tabs card>
        <!-- Render Tabs, supply a unique `key` to each tab -->
        <b-tab v-for="(rss, index) in this.rssList" 
          :key="`dyn-tab-${index}`" 
          :title="rss.name" 
          @click="() => selectTab(index)">
          <b-form> 
            <b-form-group
              v-for="(value, key) in rss"
              v-show="key !== 'rowId'"
              :key="`${key}-${value}`"
              :id="`input-group-${key}`"
              :label="`RSS ${key}`"
              :label-for="`input-${key}`"
              description="">
              <b-form-input
                v-if="key !== 'rowId'"
                :id="`input-${key}`"
                :disabled="readOnly && key === 'name'"
                v-model="tab[key]"
                type="text"
                required
                :placeholder="`Enter ${key}`"
              ></b-form-input>
            </b-form-group>
          </b-form>
           <b-button size="sm" variant="danger" class="float-right" @click="() => closeTab(rss.name)"
              style="margin-bottom: 10px;">
            Delete tab
          </b-button>
          <b-button size="sm" variant="primary" class="float-right" @click="() => saveTab(index)"
              style="margin-bottom: 10px; margin-right: 5px;">
            Save tab
          </b-button>
        </b-tab>

        <!-- New Tab Button (Using tabs slot) -->
        <template slot="tabs">
          <b-nav-item @click.prevent="newTab" href="#"><b>+</b></b-nav-item>
        </template>

        <!-- Render this if no tabs -->
        <div slot="empty" class="text-center text-muted">
          There are no open tabs<br>
          Open a new tab using the <b>+</b> button above.
        </div>
      </b-tabs>
    </b-card>
  </div>
</template>
<script>
import axios from '~/plugins/axios'

export default {
  data() {
    return {
      tabCounter: 0,
      currIndex: 0
    }
  },
  methods: {
    closeTab(x) {
      this.$bvModal.msgBoxConfirm('Are you sure you want to delete?')
      .then(value => {
        if(value === true) {
          axios.post('/api/setting/rss/delete', this.tab)
          .then(res => {
            for (let i = 0; i < this.rssList.length; i++) {
              if (this.rssList[i].name === x) {
                this.rssList.splice(i, 1)
              }
            }
            this.$bvModal.msgBoxOk('Delete successful.')
            axios.get('/api/setting/rss', {})
            .then(res => {
              this.rssList = res.data
              this.selectTab(this.currIndex-1)
            })
            .catch(err => {
              console.log(err)
            })
          })
          .catch(err => {
            console.log(err)
          })
        }
      })
      .catch(err => {
        // An error occurred
      })
    },
    newTab() {
      let obj = {}
      for(let key in this.rssList[0]) {
        obj[key] = null
      }
      if(!this.rssList[0]) {
        for(let key in this.tab) {
          obj[key] = null
        }
      }
      obj['name'] = 'NEW RSS' + ++this.tabCounter
      obj['rowId'] = 0
      this.tab.name = obj.name
      this.readOnly = false
      this.rssList.push(
        obj
      )
    },
    selectTab(x) {
      this.currIndex = x
      for(let key in this.rssList[x]) {
        this.tab[key] = this.rssList[x][key]
      }
      this.readOnly = this.rssList[x].rowId !== 0
    },
    saveTab(x) {
      this.$bvModal.msgBoxConfirm('Are you sure you want to save?')
      .then(value => {
        if(value === true) {
          axios.post('/api/setting/rss', this.tab)
          .then(res => {
            this.$bvModal.msgBoxOk('Save successful.')
            axios.get('/api/setting/rss', {})
            .then(res => {
              this.rssList = res.data
              this.selectTab(this.currIndex)
            })
            .catch(err => {
              console.log(err)
            })
          })
          .catch(err => {
            console.log(err)
          })
        }
      })
      .catch(err => {
        // An error occurred
      })
    }
  },
  async asyncData ({ app }) {
    const res = await axios.get('/api/setting/rss', {})
    return { 
      rssList: res.data,
      readOnly: true,
      tab: {
        name: res.data[0] ? res.data[0].name : null,
        url: res.data[0] ? res.data[0].url : null,
        searchKey: res.data[0] ? res.data[0].searchKey : null,
        searchVal: res.data[0] ? res.data[0].searchVal : null,
        boardKey: res.data[0] ? res.data[0].boardKey : null,
        boardVal: res.data[0] ? res.data[0].boardVal : null,
        pageKey: res.data[0] ? res.data[0].pageKey : null,
        pageVal: res.data[0] ? res.data[0].pageVal : 0,
        rowId: res.data[0] ? res.data[0].rowId : 0,
        linkKey: res.data[0] ? res.data[0].linkKey : 0
      } 
    }
  }
}
</script>

