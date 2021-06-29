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
          Authentication failed. Please ensure that your username and password is correct, or reach out to a manager to have your password reset.
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="$store.dispatch('toggleLoginFailure', false)"
          >
            Try Again
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      hasError: false
    }
  },
  watch: {
    "$store.state.auth.userId": function() {
      if (this.$store.state.auth.userId !== null) {
        this.$store.dispatch("toggleLoginFailure", false);
        this.$store.dispatch("toggleLoadingOverlay", false);
        this.$router.push({ name: "Dashboard" });
      }
    },
    "$store.state.auth.loginFailed": function() {
      if (this.$store.state.auth.loginFailed === true) {
        this.hasError = true
      } else this.hasError = false
    }
  }
}
</script>