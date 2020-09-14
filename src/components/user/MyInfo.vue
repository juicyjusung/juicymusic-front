<template>
  <v-row justify="center">
    <v-dialog :value="isShow" persistent max-width="450">
      <v-card>
        <v-card-title class="headline">MY INFO - {{ userId }} - {{ name }}</v-card-title>
        <v-card-text>
          간단하게 패스워드만 변경할수있도록 구현하였습니다.
        </v-card-text>
        <v-card-text>
          <v-text-field
            v-model="editUserInput.password"
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
            v-model="editUserInput.confirmPassword"
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

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-3" text @click="onClose">취소</v-btn>
          <v-btn color="green darken-1" text @click="submit()">수정</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import { State, Action } from 'vuex-class';
import { User } from '@/types/User';
import { getKeyValue } from '@/utils/CommonUtils';
import { VForm } from '@/types/Common';
import { ResponseBody } from '@/types/Reponse';
import { AuthActionTypes, AuthStateTypes } from '@/store/auth';

type EditUserInput = {
  password: string;
  confirmPassword: string;
};

@Component({
  components: {},
})
export default class MyInfo extends Vue {
  /******************************************************************
   * Store
   * ****************************************************************/
  @State(AuthStateTypes.USERID, { namespace: 'auth' }) private readonly userId!: string;
  @State(AuthStateTypes.NAME, { namespace: 'auth' }) private readonly name!: string;
  @Action(AuthActionTypes.UPDATE_USER, { namespace: 'auth' }) private updateUser!: (user: User) => ResponseBody;
  /******************************************************************
   * Props & Emit
   * ****************************************************************/
  @Prop(Boolean) private readonly isShow?: boolean;
  @Emit('onClose') private onClose() {
    this.init();
  }

  /******************************************************************
   * Variable
   * ****************************************************************/
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
  private editUserInput: EditUserInput = {
    password: '',
    confirmPassword: '',
  };
  private formHasErrors = false;

  get passwordConfirmationRule() {
    return () => this.editUserInput.password === this.editUserInput.confirmPassword || 'Password must match';
  }
  /******************************************************************
   * Life Cycles
   * ****************************************************************/
  private created() {}

  /******************************************************************
   * Methods
   * ****************************************************************/
  protected async submit() {
    this.formHasErrors = false;
    Object.keys(this.editUserInput).forEach((key: string) => {
      if (!getKeyValue(key)(this.editUserInput)) this.formHasErrors = true;
      const form = this.$refs[key] as VForm;
      form.validate(true);
    });
    if (this.formHasErrors) return;
    try {
      const body = await this.updateUser({
        userId: this.userId,
        name: this.name,
        password: this.editUserInput.password,
      });
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
          text: '비밀번호 변경이 완료되었습니다!',
        });
        this.onClose();
      }
    } catch (e) {
      console.error(e);
    }
  }
  init() {
    this.editUserInput = {
      password: '',
      confirmPassword: '',
    };
  }
}
</script>
