<template>
  <v-dialog
      transition="dialog-top-transition"
      v-model="hasError"
      width="400"
      persistent
    >
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Login Failed
        </v-card-title>

        <v-card-text>
          {{ errorMessage }}
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="clearErrorState"
          >
            Try Again
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
export default {
  computed: {
    errorMessage() {
      return this.$store.getters['auth/loginFailedMessage'] === '' ? '' : this.$store.getters['auth/loginFailedMessage']
    }
  },
  data() {
    return {
      hasError: false
    }
  },
  methods: {
    clearErrorState() {
      this.$store.commit('auth/CLEAR_LOGIN_ERRORS')
      this.$store.dispatch('auth/toggleLoginFailure', false, { root: true })
    }
  },
  watch: {
    "$store.state.auth.userId": function() {
      if (this.$store.getters['auth/userId'] !== null) {
        this.$store.dispatch("auth/toggleLoginFailure", false);
        this.$store.dispatch("ui/toggleLoadingOverlay", false);
        this.$router.push({ name: "Dashboard" });
      }
    },
    "$store.state.auth.loginFailed": function() {
      if (this.$store.getters['auth/loginFailed'] === true) {
        this.hasError = true
      } else this.hasError = false
    }
  }
}
</script>