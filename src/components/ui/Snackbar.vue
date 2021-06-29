<template>
  <v-snackbar
      v-model="$store.state.ui.snackbar.isActive"
      :timeout="timeout"
    >
      {{ text }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="blue"
          text
          v-bind="attrs"
          @click="closeSnackbar"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
</template>

<script>
export default {
  computed: {
    text() {
      return this.$store.state.ui.snackbar.message
    },
    timeout() {
      return this.$store.state.ui.snackbar.timeoutInterval * 1000
    }
  },
  methods: {
    closeSnackbar() {
      this.$store.commit("closeSnackbar")
    }
  }
}
</script>