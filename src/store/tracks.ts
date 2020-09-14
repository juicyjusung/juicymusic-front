import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import { User } from '@/types/User';
import Vue from 'vue';
import ApiUrl from '@/constants/apiUrl';
import { Track } from '@/types/Track';
import { ResponseBody } from '@/types/Reponse';

export enum TracksStateTypes {
  TRACK_LIST = 'trackList',
  SELECTED_TRACK = 'selectedTrack',
  SEARCH_KEYWORD = 'searchKeyword',
}

export enum TracksMutationTypes {
  SET_TRACKLIST = 'MUTATION_SET_TRACKLIST',
  SET_SELECTED_TRACK = 'MUTATION_SET_SELECTED_TRACK',
  SET_SEARCH_KEYWORD = 'MUTATION_SET_SEARCH_KEYWORD',
}

export enum TracksActionTypes {
  GET_ALL_TRACKS = 'ACTION_GET_ALL_TRACKS',
  ADD_TRACK = 'ACTION_ADD_TRACK',
  SET_SELECTED_TRACK = 'ACTION_SET_SELECTED_TRACK',
  SET_SEARCH_KEYWORD = 'ACTION_SET_SEARCH_KEYWORD',
}

export enum TracksGettersTypes {
  GET_FILTERED_TRACKS = 'GET_FILTERED_TRACKS',
}

@Module({
  namespaced: true,
})
export default class Tracks extends VuexModule {
  private trackList: Track[] = [];

  @Mutation
  [TracksMutationTypes.SET_TRACKLIST](payload: Track[]) {
    this.trackList = payload;
  }
  @Mutation
  [TracksMutationTypes.SET_SELECTED_TRACK](payload: Track) {
    this.selectedTrack = payload;
  }
  @Mutation
  [TracksMutationTypes.SET_SEARCH_KEYWORD](payload: string) {
    this.searchKeyword = payload;
  }

  @Action
  async [TracksActionTypes.GET_ALL_TRACKS](user: User) {
    try {
      const res = await Vue.prototype.$axios({
        method: 'get',
        url: ApiUrl.getAllTracks,
      });
      if (res && res.data) {
        this.context.commit(TracksMutationTypes.SET_TRACKLIST, res.data.responseData);
      }
    } catch (e) {
      console.error(e);
    }
  }

  @Action
  async [TracksActionTypes.ADD_TRACK](track: Track) {
    try {
      const formData: FormData = new FormData();
      formData.append('file', track.file as Blob);
      formData.append('title', track.title);
      formData.append('artist', track.artist);
      formData.append('album', track.album);
      const res = await Vue.prototype.$axios({
        method: 'post',
        url: ApiUrl.addTrack,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: formData,
      });
      if (res?.data) {
        return res.data as ResponseBody;
      }
    } catch (e) {
      console.error(e);
    }
  }
}
