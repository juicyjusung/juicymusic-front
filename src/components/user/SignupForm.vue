<template>
  <v-card class="elevation-6 ma-auto rounded-lg" width="400px" min-width="300px" ref="form" light>
    <v-card-title class="d-flex justify-center py-6">
      Signup
    </v-card-title>
    <v-card-text class="d-flex flex-column">
      <v-text-field
        v-model="signupInput.userId"
        ref="userId"
        :rules="rules.userIdRules"
        prepend-icon="fas fa-user-tag"
        label="ID"
        required
      ></v-text-field>
      <v-text-field
        v-model="signupInput.name"
        ref="name"
        :rules="rules.nameRules"
        prepend-icon="fas fa-user"
        label="Username"
        required
      ></v-text-field>
      <v-text-field
        v-model="signupInput.password"
        ref="password"
        prepend-icon="fas fa-lock"
        :rules="rules.passwordRules"
        type="password"
        name="password"
        label="Password"
        class="input-group--focused"
        required
      ></v-text-field>
      <v-text-field
        v-model="signupInput.confirmPassword"
        ref="confirmPassword"
        prepend-icon="fas fa-lock"
        :rules="[passwordConfirmationRule, ...rules.confirmPassRules]"
        type="password"
        name="confirmPassword"
        label="Confirm Password"
        class="input-group--focused"
        required
        @keyup.native.enter="submit()"
      ></v-text-field>
    </v-card-text>
    <v-card-actions class="d-flex align-center justify-center ">
      <v-btn class="mx-2" color="secondary" @click.stop="onClose">Cancel</v-btn>
      <v-btn class="ma-2" color="primary" @click.stop="submit">OK</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script lang="ts">
import { Component, Emit, Vue } from 'vue-property-decorator';
import { VForm } from '@/types/Common';
import { getKeyValue } from '@/utils/CommonUtils';
import { Action } from 'vuex-class';
import { ResponseBody } from '@/types/Reponse';
import { AuthActionTypes } from '@/store/auth';

type SignupInput = {
  userId: string;
  name: string;
  password: string;
  confirmPassword: string;
};

@Component({
  components: {},
})
export default class SignupForm extends Vue {
  /******************************************************************
   * Store
   * ****************************************************************/
  @Action(AuthActionTypes.SIGNUP, { namespace: 'auth' }) private signup!: (user: SignupInput) => ResponseBody;

  /******************************************************************
   * Props & Emit
   * ****************************************************************/
  @Emit('onClose') private onClose() {}

  /******************************************************************
   * Variable
   * ****************************************************************/
  private signupInput: SignupInput = {
    userId: '',
    name: '',
    password: '',
    confirmPassword: '',
  };
  private formHasErrors = false;
  private rules = {
    userIdRules: [(v: string) => !!v || 'ID is required'],
    nameRules: [(v: string) => !!v || 'username is required'],
    passwordRules: [
      (v: string) => !!v || 'Please enter your password',
      (v: string) => v.length >= 8 || 'Password must be at least 8 characters long',
    ],
    confirmPassRules: [
      (v: string) => !!v || 'Please enter your password',
      (v: string) => v.length >= 8 || 'Password must be at least 8 characters long',
    ],
  };
  get form() {
    return this.signupInput;
  }

  get passwordConfirmationRule() {
    return () => this.signupInput.password === this.signupInput.confirmPassword || 'Password must match';
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
      const body = await this.signup(this.signupInput);
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
          text: '회원가입이 완료되었습니다! 로그인해주세요.',
        });
        this.onClose();
      }
    } catch (e) {
      console.error(e);
    }
  }
}
</script>
