import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';
import { User } from '@/types/User';
import Vue from 'vue';
import ApiUrl from '@/constants/apiUrl';

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
export default class Auth extends VuexModule {
  private userId: string = 'asd';
  private name: string = '';
  private isSessionActive: boolean = false;

  @Mutation
  setUserId(payload: string) {
    this.userId = payload;
    localStorage.setItem('userId', this.userId);
  }

  @Mutation
  setUserName(payload: string) {
    this.name = payload;
    localStorage.setItem('name', this.name);
  }

  @Mutation
  setSessionActive(payload: boolean) {
    console.log('%c [JL] setSessionActive - payload', 'font-size: 16px; color:  red;', payload);
    this.isSessionActive = payload;
    if (!payload) {
      localStorage.removeItem('userId');
      localStorage.removeItem('name');
    }
  }

  @Action
  async signup(user: User) {
    try {
      const res = await Vue.prototype.$axios({
        method: 'post',
        url: ApiUrl.register,
        data: user,
      });
      if (res?.data) {
        const { userId, name } = res as User;
        this.context.commit('setUserId', userId);
        this.context.commit('setUserName', name);
        return res.data;
      }
    } catch (e) {
      console.error(e);
    }
  }

  @Action
  async login(user: User) {
    try {
      const res = await Vue.prototype.$axios({
        method: 'post',
        url: ApiUrl.login,
        data: user,
      });

      if (res?.data?.responseData) {
        const data = res.data.responseData;
        const { userId, name: name } = data;
        this.context.commit('setUserId', userId);
        this.context.commit('setUserName', name);
        this.context.commit('setSessionActive', true);
        return res.data;
      }
      return res.data;
    } catch (err) {
      throw new Error(err);
    }
  }

  @Action
  async updateUser(user: User) {
    try {
      const res = await Vue.prototype.$axios({
        method: 'put',
        url: ApiUrl.updateUser,
        data: user,
      });
      if (res?.data) {
        const { userId, name } = res as User;
        this.context.commit('setUserId', userId);
        this.context.commit('setUserName', name);
        return res.data;
      }
    } catch (err) {
      throw new Error(err);
    }
  }

  @Action
  async logout() {
    try {
      await Vue.prototype.$axios({
        method: 'get',
        url: ApiUrl.logout,
      });

      this.context.commit('setUserId', '');
      this.context.commit('setUserName', '');
      this.context.commit('setSessionActive', false);
      localStorage.removeItem('userId');
      localStorage.removeItem('name');
    } catch (err) {
      throw new Error(err);
    }
  }

  @Action
  async initiateAppSession() {
    const res = await Vue.prototype.$axios({
      method: 'get',
      url: ApiUrl.isSessionActive,
    });
    console.log('%c [JL] initiateAppSession - res', 'font-size: 16px; color:  red;', res);
    if (res && res.data === true) {
      this.context.commit('setUserId', localStorage.getItem('userId'));
      this.context.commit('setUserName', localStorage.getItem('name'));
      this.context.commit('setSessionActive', true);
      return true;
    } else {
      this.context.commit('setSessionActive', false);
      return false;
    }
  }
}
