<template>
  <v-snackbar
      v-model="snackbar"
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
    snackbar() {
      return this.$store.state.ui.snackbar.isActive
    },
    timeout() {
      return this.$store.state.ui.snackbar.timeoutInterval * 1000
    }
  },
  methods: {
    closeSnackbar() {
      this.$store.commit("toggleSnackbar", false, '')
    }
  }
}
</script>