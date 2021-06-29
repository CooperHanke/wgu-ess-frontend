<template>
  <v-snackbar
      v-model="$store.state.ui.snackbar.isActive"
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
    }
  },
  methods: {
    closeSnackbar() {
      this.$store.commit("CLOSE_SNACKBAR")
    }
  }
}
</script>