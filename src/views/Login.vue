<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Please Log In</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form ref="loginForm" v-model="valid">
              <v-text-field
                prepend-icon="mdi-account"
                name="username"
                label="Login"
                type="text"
                v-model="username"
                :rules="rules"
              ></v-text-field>
              <v-text-field
                id="password"
                prepend-icon="mdi-lock"
                name="password"
                label="Password"
                type="password"
                v-model="password"
                :rules="rules"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" v-show="passwordResetEnabled" @click="resetPassword" >REQUEST PASSWORD RESET</v-btn>
            <v-spacer></v-spacer>
            <v-btn @click="performLogin" color="primary" :disabled="!valid">Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>

    <login-error />

    <reset-password-dialog />

  </v-container>

  
</template>

<script>
import LoginError from '@/components/login/LoginError.vue'
import ResetPasswordDialog from '@/components/login/ResetPasswordDialog.vue'
export default {
  components: {
    LoginError,
    ResetPasswordDialog
  },
  computed: {
    passwordResetEnabled() {
      return this.$store.state.auth.enablePasswordReset
    }
  },
  data() {
    return {
      username: "",
      password: "",
      rules: [
        v => !!v || 'This field is required'
      ],
      valid: true
    };
  },
  methods: {
    performLogin() {
      this.$store.dispatch("attemptAuth", {
        username: this.username,
        password: this.password,
      });
      this.$refs.loginForm.reset()
    },
    resetPassword() {
      this.$store.dispatch("openResetPasswordDialog")
    }
  },
};
</script>