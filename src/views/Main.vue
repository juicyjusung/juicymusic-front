<template>
  <div>
    <v-app>
      <v-app-bar color="#FFF" app>
        <v-btn class="mx-2" fab dark small color="purple" @click.stop="() => (addTrackModal = true)">
          <v-icon dark size="xs">fas fa-plus</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-combobox
          :items="data.map(v => v.title)"
          @update:search-input="searchKeyword"
          cache-items
          class="mx-4"
          flat
          hide-no-data
          hide-details
          label="음악 제목 검색"
          solo-inverted
          color="primary"
          hide-selected
          clearable
        ></v-combobox>

        <v-btn primary class="mx-2" @click.stop="() => (myInfoModal = true)">MyInfo</v-btn>
        <v-btn primary class="mx-2" @click.stop="onLogoutClick">Log out</v-btn>
      </v-app-bar>

      <v-main>
        <v-container class="fill-height">
          <MusicTrackList></MusicTrackList>
        </v-container>
      </v-main>

      <v-footer class="flex-row">
        <aplayer v-if="selectedTrack" ref="aplayer" class="flex" :audio="dataForPlayer" :autoplay="true"></aplayer>
      </v-footer>
    </v-app>
    <AddTrackModal :key="Date.now()" :is-show="addTrackModal" @onClose="onAddTrackModalClose"></AddTrackModal>
    <MyInfo :is-show="myInfoModal" @onClose="() => (myInfoModal = false)"></MyInfo>
  </div>
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

  get dataForPlayer() {
    if (!this.selectedTrack) return {};
    const track = this.selectedTrack;
    return {
      name: track.title,
      artist: track.artist,
      url: track.filePath,
      cover: track.albumArtPath,
    };
  }

  /******************************************************************
   * Life Cycles
   * ****************************************************************/
  private created() {
    this.getAllTracks();
  }
  private mounted() {}

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
  searchKeyword(keyword: string) {
    this.setSearchKeyword(keyword);
  }
}
</script>
