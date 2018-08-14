<template>
  <b-alert
    :show="$store.state.alert.dismissCountDown"
    dismissible
    variant="info"
    @dismissed="$store.state.alert.dismissCountDown=0"
    @dismiss-count-down="setAlertCountDown"
    style="margin-bottom: 0;">
    <h6>Download complete</h6>
    <p class="text-truncate">{{ $store.state.alert.message }}</p>
    <b-progress variant="info"
       :max="$store.state.alert.dismissSecs"
       :value="$store.state.alert.dismissCountDown"
       height="4px">
    </b-progress>
  </b-alert>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  methods: {
    ...mapMutations([
      'setAlertCountDown'
    ])
  }
}
</script>

<style scoped>
</style>
