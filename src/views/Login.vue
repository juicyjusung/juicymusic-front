<template>
  <v-container class="fill-height align-center justify-center">
    <LoginForm @onOpenSignup="() => (signupOverlay = true)"></LoginForm>
    <v-overlay :value="signupOverlay" light :opacity="0.9">
      <SignupForm @onClose="() => (signupOverlay = false)"> </SignupForm>
    </v-overlay>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import LoginForm from '@/components/user/LoginForm.vue';
import SignupForm from '@/components/user/SignupForm.vue';

@Component({
  components: { SignupForm, LoginForm },
})
export default class Login extends Vue {
  /******************************************************************
   * Variable
   * ****************************************************************/
  private signupOverlay = false;

  /**************************************************************************
   * Methods
   * ***********************************************************************/
}
</script>
