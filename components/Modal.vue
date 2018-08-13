<template>
  <b-modal
    v-model="$store.state.modal.show"
    :title="this.modal.data.title"
    :header-text-variant="this.modal.data.textVariant"
    class="d-inline-block"
    hide-footer>
    <div :class="this.modal.data.bodyClass">
      <h6 class="my-4 text-truncate">{{this.modal.data.name}}</h6>
      <p class="text-success text-truncate">{{this.modal.data.path == undefined ? '/download' : this.modal.data.path}}</p>
    </div>
    <div v-if="this.modal.data.successMark">
      <div class="check_mark">
        <div class="sa-icon sa-success animate">
          <span class="sa-line sa-tip animateSuccessTip"></span>
          <span class="sa-line sa-long animateSuccessLong"></span>
          <div class="sa-placeholder"></div>
          <div class="sa-fix"></div>
        </div>
      </div>
    </div>
    <div :class="this.modal.data.bodyClass">
      <hr/>
      <b-button block variant="link" @click="download()">Download Request</b-button>
    </div>
  </b-modal>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import axios from '~/plugins/axios'

export default {
  computed: mapState([
    'modal'
  ]),
  methods: {
    ...mapMutations([
      'setTorr',
      'hideModal'
    ]),
    download: function () {
      axios.post('/api/download', this.modal.data)
        .then(res => {
          const ret = res.data.id !== undefined ? 'success' : 'failure'

          this.modal.data.title = 'Download request ' + ret

          if (ret === 'success') {
            this.setTorr({
              'tid': res.data.id,
              'target': this.modal.data.target,
              'index': this.modal.data.index
            })
            /*
            for (var i = 0; i < this.data.length; i++) {
              if (this.data[i].no === this.modal.dat.no) {
                this.data[i].tid = res.data.id
                this.data[i].target = this.modal.dat.target
                break
              }
            }
            */

            this.modal.data.bodyClass = 'hide'
            this.modal.data.successMark = true
            this.modal.data.textVariant = 'success'
            setTimeout(() => { this.hideModal() }, 2000)
          } else {
            this.modal.data.textVariant = 'danger'
          }
        })
        .catch((err) => {
          alert(err)
          this.modal.data.textVariant = 'danger'
          this.modal.data.title = 'Error'
          this.modal.data.name = err.message
        })
    }
  }
}
</script>

<style scoped>
/* success animation*/
.check_mark {
  width: 80px;
  height: 130px;
  margin: 0 auto;
}

.hide{
  display:none;
}

.sa-icon {
  width: 80px;
  height: 80px;
  border: 4px solid gray;
  -webkit-border-radius: 40px;
  border-radius: 40px;
  border-radius: 50%;
  margin: 20px auto;
  padding: 0;
  position: relative;
  box-sizing: content-box;
}

.sa-icon.sa-success {
  border-color: #4CAF50;
}

.sa-icon.sa-success::before, .sa-icon.sa-success::after {
  content: '';
  -webkit-border-radius: 40px;
  border-radius: 40px;
  border-radius: 50%;
  position: absolute;
  width: 60px;
  height: 120px;
  background: white;
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
}

.sa-icon.sa-success::before {
  -webkit-border-radius: 120px 0 0 120px;
  border-radius: 120px 0 0 120px;
  top: -7px;
  left: -33px;
  -webkit-transform: rotate(-45deg);
  transform: rotate(-45deg);
  -webkit-transform-origin: 60px 60px;
  transform-origin: 60px 60px;
}

.sa-icon.sa-success::after {
  -webkit-border-radius: 0 120px 120px 0;
  border-radius: 0 120px 120px 0;
  top: -11px;
  left: 30px;
  -webkit-transform: rotate(-45deg);
  transform: rotate(-45deg);
  -webkit-transform-origin: 0px 60px;
  transform-origin: 0px 60px;
}

.sa-icon.sa-success .sa-placeholder {
  width: 80px;
  height: 80px;
  border: 4px solid rgba(76, 175, 80, .5);
  -webkit-border-radius: 40px;
  border-radius: 40px;
  border-radius: 50%;
  box-sizing: content-box;
  position: absolute;
  left: -4px;
  top: -4px;
  z-index: 2;
}

.sa-icon.sa-success .sa-fix {
  width: 5px;
  height: 90px;
  background-color: white;
  position: absolute;
  left: 28px;
  top: 8px;
  z-index: 1;
  -webkit-transform: rotate(-45deg);
  transform: rotate(-45deg);
}

.sa-icon.sa-success.animate::after {
  -webkit-animation: rotatePlaceholder 4.25s ease-in;
  animation: rotatePlaceholder 4.25s ease-in;
}

.sa-icon.sa-success {
  border-color: transparent\9;
}
.sa-icon.sa-success .sa-line.sa-tip {
  -ms-transform: rotate(45deg) \9;
}
.sa-icon.sa-success .sa-line.sa-long {
  -ms-transform: rotate(-45deg) \9;
}

.animateSuccessTip {
  -webkit-animation: animateSuccessTip 0.75s;
  animation: animateSuccessTip 0.75s;
}

.animateSuccessLong {
  -webkit-animation: animateSuccessLong 0.75s;
  animation: animateSuccessLong 0.75s;
}

@-webkit-keyframes animateSuccessLong {
  0% {
    width: 0;
    right: 46px;
    top: 54px;
  }
  65% {
    width: 0;
    right: 46px;
    top: 54px;
  }
  84% {
    width: 55px;
    right: 0px;
    top: 35px;
  }
  100% {
    width: 47px;
    right: 8px;
    top: 38px;
  }
}
@-webkit-keyframes animateSuccessTip {
  0% {
    width: 0;
    left: 1px;
    top: 19px;
  }
  54% {
    width: 0;
    left: 1px;
    top: 19px;
  }
  70% {
    width: 50px;
    left: -8px;
    top: 37px;
  }
  84% {
    width: 17px;
    left: 21px;
    top: 48px;
  }
  100% {
    width: 25px;
    left: 14px;
    top: 45px;
  }
}
@keyframes animateSuccessTip {
  0% {
    width: 0;
    left: 1px;
    top: 19px;
  }
  54% {
    width: 0;
    left: 1px;
    top: 19px;
  }
  70% {
    width: 50px;
    left: -8px;
    top: 37px;
  }
  84% {
    width: 17px;
    left: 21px;
    top: 48px;
  }
  100% {
    width: 25px;
    left: 14px;
    top: 45px;
  }
}

@keyframes animateSuccessLong {
  0% {
    width: 0;
    right: 46px;
    top: 54px;
  }
  65% {
    width: 0;
    right: 46px;
    top: 54px;
  }
  84% {
    width: 55px;
    right: 0px;
    top: 35px;
  }
  100% {
    width: 47px;
    right: 8px;
    top: 38px;
  }
}

.sa-icon.sa-success .sa-line {
  height: 5px;
  background-color: #4CAF50;
  display: block;
  border-radius: 2px;
  position: absolute;
  z-index: 2;
}

.sa-icon.sa-success .sa-line.sa-tip {
  width: 25px;
  left: 14px;
  top: 46px;
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
}

.sa-icon.sa-success .sa-line.sa-long {
  width: 47px;
  right: 8px;
  top: 38px;
  -webkit-transform: rotate(-45deg);
  transform: rotate(-45deg);
}

@-webkit-keyframes rotatePlaceholder {
  0% {
    transform: rotate(-45deg);
    -webkit-transform: rotate(-45deg);
  }
  5% {
    transform: rotate(-45deg);
    -webkit-transform: rotate(-45deg);
  }
  12% {
    transform: rotate(-405deg);
    -webkit-transform: rotate(-405deg);
  }
  100% {
    transform: rotate(-405deg);
    -webkit-transform: rotate(-405deg);
  }
}
@keyframes rotatePlaceholder {
  0% {
    transform: rotate(-45deg);
    -webkit-transform: rotate(-45deg);
  }
  5% {
    transform: rotate(-45deg);
    -webkit-transform: rotate(-45deg);
  }
  12% {
    transform: rotate(-405deg);
    -webkit-transform: rotate(-405deg);
  }
  100% {
    transform: rotate(-405deg);
    -webkit-transform: rotate(-405deg);
  }
}
</style>
