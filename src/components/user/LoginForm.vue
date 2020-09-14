<template>
  <v-card class="elevation-6 ma-auto rounded-lg" width="400px" min-width="300px" ref="form">
    <v-card-title class="d-flex justify-center py-6">
      juicymusic
    </v-card-title>
    <v-card-text class="d-flex flex-column">
      <v-text-field
        v-model="loginInput.userId"
        ref="userId"
        class="ma-2"
        prepend-icon="fas fa-user-tag"
        :rules="rules.useridRules"
        label="ID"
        required
      ></v-text-field>
      <v-text-field
        v-model="loginInput.password"
        ref="password"
        class="ma-2 input-group--focused"
        prepend-icon="fas fa-lock"
        :rules="rules.min"
        :append-icon="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
        :type="showPassword ? 'text' : 'password'"
        name="password"
        label="Password"
        required
        @keyup.native.enter="submit()"
        @click:append="showPassword = !showPassword"
      ></v-text-field>
    </v-card-text>
    <v-card-actions class="d-flex align-center justify-center ">
      <v-btn class="ma-2" color="primary" @click.stop="submit">Login</v-btn>
      <v-btn class="mx-2" color="secondary" @click.stop="onOpenSignup">Signup</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script lang="ts">
import { Component, Emit, Vue } from 'vue-property-decorator';
import { LoginInput, User } from '@/types/User';
import { VForm } from '@/types/Common';
import { getKeyValue } from '@/utils/CommonUtils';
import { Action } from 'vuex-class';
import { ResponseBody } from '@/types/Reponse';
import { AuthActionTypes } from '@/store/auth';

@Component({
  components: {},
})
export default class LoginForm extends Vue {
  /******************************************************************
   * Store
   * ****************************************************************/
  @Action(AuthActionTypes.LOGIN, { namespace: 'auth' }) private login!: (user: LoginInput) => ResponseBody;

  /******************************************************************
   * Props & Emit
   * ****************************************************************/
  @Emit('onOpenSignup') private onOpenSignup() {}

  /******************************************************************
   * Variable
   * ****************************************************************/
  private showPassword = false;
  private loginInput: LoginInput = { userId: '', password: '' };
  private formHasErrors = false;
  private rules = {
    min: [(v: string) => v.length >= 8 || 'Min 8 characters'],
    useridRules: [(v: string) => !!v || 'ID is required'],
  };
  get form() {
    return this.loginInput;
  }

  /**************************************************************************
   * Methods
   * ***********************************************************************/
  protected async submit() {
    this.formHasErrors = false;
    Object.keys(this.form).forEach((key: string) => {
      if (!getKeyValue(key)(this.form)) this.formHasErrors = true;
      const form = this.$refs[key] as VForm;
      form.validate(true);
    });
    if (this.formHasErrors) return;
    try {
      const body = await await this.login(this.loginInput);
      if (body.message) {
        this.$notify({
          group: 'all',
          type: 'error',
          text: body.message,
        });
      } else {
        this.$notify({
          group: 'all',
          type: 'success',
          text: '로그인이 완료되었습니다.',
        });
        await this.$router.push('/');
      }
    } catch (e) {
      console.error(e);
    }
  }
}
</script>
