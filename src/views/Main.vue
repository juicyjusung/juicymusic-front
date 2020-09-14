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
import MusicTrackList from '@/components/tracks/MusicTrackList.vue';
import { Action, Getter, State } from 'vuex-class';
import MyInfo from '@/components/user/MyInfo.vue';
import AddTrackModal from '@/components/tracks/AddTrackModal.vue';
import { Track } from '@/types/Track';
import { TracksActionTypes, TracksGettersTypes, TracksStateTypes } from '@/store/tracks';
import { AuthActionTypes } from '@/store/auth';

@Component({
  components: {
    AddTrackModal,
    MyInfo,
    MusicTrackList,
    Login,
  },
})
export default class Main extends Vue {
  /******************************************************************
   * Store
   * ****************************************************************/
  @State(TracksStateTypes.TRACK_LIST, { namespace: 'tracks' }) private data!: Track[];
  @State(TracksStateTypes.SELECTED_TRACK, { namespace: 'tracks' }) private selectedTrack!: Track;
  @Getter(TracksGettersTypes.GET_FILTERED_TRACKS, { namespace: 'tracks' }) private searchedList!: Track[];
  @Action(AuthActionTypes.LOGOUT, { namespace: 'auth' }) private logout!: () => void;
  @Action(TracksActionTypes.GET_ALL_TRACKS, { namespace: 'tracks' }) private getAllTracks!: () => [];
  @Action(TracksActionTypes.SET_SEARCH_KEYWORD, { namespace: 'tracks' }) private setSearchKeyword!: (
    keyword: string
  ) => void;

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
