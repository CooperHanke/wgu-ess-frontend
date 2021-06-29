<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Please Log In</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field
                prepend-icon="mdi-account"
                name="username"
                label="Login"
                type="text"
                v-model="username"
              ></v-text-field>
              <v-text-field
                id="password"
                prepend-icon="mdi-lock"
                name="password"
                label="Password"
                type="password"
                v-model="password"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="performLogin" color="primary">Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>

    <LoginError />

  </v-container>

  
</template>

<script>
import LoginError from '@/components/login/LoginError.vue'
export default {
  components: {
    LoginError
  },
  data() {
    return {
      username: "",
      password: ""
    };
  },
  methods: {
    performLogin() {
      this.$store.dispatch("attemptAuth", {
        username: this.username,
        password: this.password,
      });
      //setTimeout( () => this.$router.push({ name: 'Dashboard' }), 500) // give the requests time to work
    },
  },
};
</script>