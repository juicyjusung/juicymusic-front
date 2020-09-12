<template>
  <v-app>
    <v-app-bar color="#c9c9c9" app>
      <v-btn class="mx-2" fab dark small color="purple" @click.stop="() => (addTrackModal = true)">
        <v-icon dark size="xs">fas fa-plus</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn primary class="mx-2" @click.stop="() => (myInfoModal = true)">MyInfo</v-btn>
      <v-btn primary class="mx-2" @click.stop="onLogoutClick">Log out</v-btn>
    </v-app-bar>
    <v-main>
      <v-container class="blue fill-height">
        <MusicTrackList></MusicTrackList>
      </v-container>
    </v-main>
    <AddTrackModal :is-show="addTrackModal" @onClose="onAddTrackModalClose"></AddTrackModal>
    <MyInfo :is-show="myInfoModal" @onClose="() => (myInfoModal = false)"></MyInfo>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Login from '@/views/Login.vue';
import MusicTrackItem from '@/components/tracks/MusicTrackItem.vue';
import MusicTrackList from '@/components/tracks/MusicTrackList.vue';
import { Action } from 'vuex-class';
import MyInfo from '@/components/user/MyInfo.vue';
import AddTrackModal from '@/components/tracks/AddTrackModal.vue';

@Component({
  components: {
    AddTrackModal,
    MyInfo,
    MusicTrackList,
    MusicTrackItem,
    Login,
  },
})
export default class Main extends Vue {
  @Action('logout', { namespace: 'auth' }) private logout!: () => void;
  @Action('getAllTracks', { namespace: 'tracks' }) private getAllTracks!: () => [];
  /******************************************************************
   * Store ex: @Action('login', { namespace: 'auth' }) private login!: (user: LoginInput) => ResponseBody;
   * ****************************************************************/

  /******************************************************************
   * Props
   * ****************************************************************/

  /******************************************************************
   * Variable
   * ****************************************************************/
  private addTrackModal = false;
  private myInfoModal = false;

  /******************************************************************
   * Life Cycles
   * ****************************************************************/
  private created() {
    this.getAllTracks();
  }

  /******************************************************************
   * Methods
   * ****************************************************************/
  onLogoutClick() {
    this.logout();
    this.$notify({
      group: 'all',
      type: 'success',
      text: '로그아웃 되었습니다.',
    });
    this.$router.push('/login');
  }
  onAddTrackModalClose() {
    this.addTrackModal = false;
    this.getAllTracks();
  }
}
</script>
