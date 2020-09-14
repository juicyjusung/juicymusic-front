import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';
import { User } from '@/types/User';
import Vue from 'vue';
import ApiUrl from '@/constants/apiUrl';

export enum AuthStateTypes {
  USERID = 'userId',
  NAME = 'name',
  IS_SESSION_ACTIVE = 'isSessionActive',
}

export enum AuthMutationTypes {
  SET_USERID = 'SET_USERID',
  SET_USERNAME = 'SET_USERNAME',
  SET_SESSION_ACTIVE = 'SET_SESSION_ACTIVE',
}

export enum AuthActionTypes {
  SIGNUP = 'SIGNUP',
  LOGIN = 'LOGIN',
  UPDATE_USER = 'UPDATE_USER',
  LOGOUT = 'LOGOUT',
  INIT_APP_SESSION = 'INIT_APP_SESSION',
}

@Module({
  namespaced: true,
})
export default class Auth extends VuexModule {
  private userId: string = '';
  private name: string = '';
  private isSessionActive: boolean = false;

  @Mutation
  [AuthMutationTypes.SET_USERID](payload: string) {
    this.userId = payload;
    localStorage.setItem('userId', this.userId);
  }

  @Mutation
  [AuthMutationTypes.SET_USERNAME](payload: string) {
    this.name = payload;
    localStorage.setItem('name', this.name);
  }

  @Mutation
  [AuthMutationTypes.SET_SESSION_ACTIVE](payload: boolean) {
    this.isSessionActive = payload;
    if (!payload) {
      localStorage.removeItem('userId');
      localStorage.removeItem('name');
    }
  }

  @Action
  async [AuthActionTypes.SIGNUP](user: User) {
    try {
      const res = await Vue.prototype.$axios({
        method: 'post',
        url: ApiUrl.register,
        data: user,
      });
      if (res?.data) {
        const { userId, name } = res as User;
        this.context.commit(AuthMutationTypes.SET_USERID, userId);
        this.context.commit(AuthMutationTypes.SET_USERNAME, name);
        return res.data;
      }
    } catch (e) {
      console.error(e);
    }
  }

  @Action
  async [AuthActionTypes.LOGIN](user: User) {
    try {
      const res = await Vue.prototype.$axios({
        method: 'post',
        url: ApiUrl.login,
        data: user,
      });

      if (res?.data?.responseData) {
        const data = res.data.responseData;
        const { userId, name: name } = data;
        this.context.commit(AuthMutationTypes.SET_USERID, userId);
        this.context.commit(AuthMutationTypes.SET_USERNAME, name);
        this.context.commit(AuthMutationTypes.SET_SESSION_ACTIVE, true);
        return res.data;
      }
      return res.data;
    } catch (err) {
      throw new Error(err);
    }
  }

  @Action
  async [AuthActionTypes.UPDATE_USER](user: User) {
    try {
      const res = await Vue.prototype.$axios({
        method: 'put',
        url: ApiUrl.updateUser,
        data: user,
      });
      if (res?.data) {
        const { userId, name } = res as User;
        this.context.commit(AuthMutationTypes.SET_USERID, userId);
        this.context.commit(AuthMutationTypes.SET_USERNAME, name);
        return res.data;
      }
    } catch (err) {
      throw new Error(err);
    }
  }

  @Action
  async [AuthActionTypes.LOGOUT]() {
    try {
      await Vue.prototype.$axios({
        method: 'get',
        url: ApiUrl.logout,
      });

      this.context.commit(AuthMutationTypes.SET_USERID, '');
      this.context.commit(AuthMutationTypes.SET_USERNAME, '');
      this.context.commit(AuthMutationTypes.SET_SESSION_ACTIVE, false);
      localStorage.removeItem('userId');
      localStorage.removeItem('name');
    } catch (err) {
      throw new Error(err);
    }
  }

  @Action
  async [AuthActionTypes.INIT_APP_SESSION]() {
    const res = await Vue.prototype.$axios({
      method: 'get',
      url: ApiUrl.isSessionActive,
    });
    if (res && res.data === true) {
      this.context.commit(AuthMutationTypes.SET_USERID, localStorage.getItem('userId'));
      this.context.commit(AuthMutationTypes.SET_USERNAME, localStorage.getItem('name'));
      this.context.commit(AuthMutationTypes.SET_SESSION_ACTIVE, true);
      return true;
    } else {
      this.context.commit(AuthMutationTypes.SET_SESSION_ACTIVE, false);
      return false;
    }
  }
}
