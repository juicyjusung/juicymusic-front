<template>
  <v-hover ref="controller">
    <template v-slot:default="{ hover }">
      <div style="flex: 0 1">
        <div class="align-center" style="display: flex; align-items: center">
          <v-img :src="params.data.albumArtPath" width="100px"></v-img>
        </div>
        <v-fade-transition>
          <v-overlay v-if="hover" absolute color="#036358">
            <v-btn color="success" fab dark @click.stop="playTack(params.data)">
              <v-icon>fas fa-play</v-icon>
            </v-btn>
          </v-overlay>
        </v-fade-transition>
      </div>
    </template>
  </v-hover>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Track } from '@/types/Track';
import { Action } from 'vuex-class';
import { TracksActionTypes } from '@/store/tracks';

@Component({})
export default class Test extends Vue {
  /******************************************************************
   * Store
   * ****************************************************************/
  @Action(TracksActionTypes.SET_SELECTED_TRACK, { namespace: 'tracks' }) private selectTrack!: (
    track: Track | null
  ) => void;
  /******************************************************************
   * Variable
   * ****************************************************************/
  private overlay = false;

  /*********************************************************************************
   * Life Cycles
   * ********************************************************************************/
  mounted() {}
  /**************************************************************************
   * Methods
   * ***********************************************************************/
  playTack(track: Track) {
    this.selectTrack(null);
    this.selectTrack(track);
  }
}
</script>

<style lang="scss">
.card-wrapper {
  max-width: 500px;
}
</style>
