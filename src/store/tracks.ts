import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import { User } from '@/types/User';
import Vue from 'vue';
import ApiUrl from '@/constants/apiUrl';
import { Track } from '@/types/Track';
import { ResponseBody } from '@/types/Reponse';

export enum test {
  TEST = 'TEST',
}

// export enum AuthStateTypes {
//   USERID = 'USERID',
//   USERNAME = 'USERNAME',
//   IS_SESSION_ACTIVE = 'IS_SESSION_ACTIVE',
// }

export enum AuthMutationTypes {
  SET_USERID = 'SET_USERID',
  SET_USERNAME = 'SET_USERNAME',
  SET_SESSION_ACTIVE = 'SET_SESSION_ACTIVE',
}

@Module({
  namespaced: true,
})
export default class Tracks extends VuexModule {
  private trackList: Track[] = [];

  @Mutation
  setTrackList(payload: Track[]) {
    this.trackList = payload;
  }

  @Action
  async getAllTracks(user: User) {
    try {
      const res = await Vue.prototype.$axios({
        method: 'get',
        url: ApiUrl.getAllTracks,
      });
      if (res && res.data) {
        console.log('%c [JL] getAllTracks - res', 'font-size: 16px; color:  red;', res);
        console.log('%c [JL] getAllTracks - res.data', 'font-size: 16px; color:  red;', res.data);
        this.context.commit('setTrackList', res.data.responseData);
      }
    } catch (e) {
      console.error(e);
    }
  }

  @Action
  async addTrack(track: Track) {
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
