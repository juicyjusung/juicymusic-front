<template>
  <v-app id="app">
    <notifications group="all" width="100%" position="bottom center" />
    <div v-if="isLoading">
      <fingerprint-spinner class="spinner" :animation-duration="1500" :size="150" color="#136a8a" />
    </div>
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { FingerprintSpinner } from 'epic-spinners';
import { eventHub } from '@/utils/eventHub';
import { namespace, State } from 'vuex-class';

const module = namespace('auth');

@Component({
  components: {
    FingerprintSpinner,
  },
})
export default class App extends Vue {
  /******************************************************************
   * Variable
   * ****************************************************************/
  private refCount = 0;
  private isLoading = false;

  /*********************************************************************************
   * Life Cycles
   * ********************************************************************************/
  async created() {
    eventHub.$on('before-request', this.setLoading);
    eventHub.$on('request-error', this.unsetLoading);
    eventHub.$on('after-response', this.unsetLoading);
    eventHub.$on('response-error', this.unsetLoading);
    // await this.$store.dispatch('authStore/initiateAppSession');
  }
  beforeDestroy() {
    eventHub.$off('before-request', this.setLoading);
    eventHub.$off('request-error', this.unsetLoading);
    eventHub.$off('after-response', this.unsetLoading);
    eventHub.$off('response-error', this.unsetLoading);
  }

  /**************************************************************************
   * Methods
   * ***********************************************************************/
  setLoading() {
    this.refCount += 1;
    this.isLoading = true;
  }

  unsetLoading() {
    if (this.refCount > 0) {
      this.refCount -= 1;
      this.isLoading = this.refCount > 0;
    }
  }
}
</script>

<style lang="scss">
#app {
  $body-font-family: 'Noto Sans KR', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.notification-content {
  text-align: center;
}
.notifications {
  .notification-wrapper {
    width: 100vw;
  }

  span {
    display: block;
  }
}

.spinner {
  position: fixed !important;
  top: 0 !important;
  height: 100vh !important;
  width: 100% !important;
  z-index: 10000 !important;
  background: rgba(255, 255, 255, 0.8) !important;
}
.fade-enter-active {
  transition-duration: 0.3s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
