<template>
  <b-alert
    class="my-alert"
    :show="$store.state.alert.dismissCountDown"
    dismissible
    fade
    :variant="$store.state.alert.variant"
    @dismissed="$store.state.alert.dismissCountDown=0"
    @dismiss-count-down="setAlertCountDown"
    style="margin-bottom: 0;">
    <h6>{{ $store.state.alert.title }}</h6>
    <p class="text-truncate">{{ $store.state.alert.message }}</p>
    <b-progress
      :variant="$store.state.alert.variant"
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
    ...mapMutations(['setAlertCountDown'])
  }
}
</script>

<style scoped>
.my-alert {
  -webkit-border-bottom-left-radius: 0;
  border-bottom-left-radius: 0;
  -webkit-border-bottom-right-radius: 0;
  border-bottom-right-radius: 0;
}
</style>
