<template>
  <v-snackbar
      v-model="$store.getters['ui/isSnackbarActive']"
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
      return this.$store.getters['ui/snackbarMessage']
    }
  },
  methods: {
    closeSnackbar() {
      this.$store.commit("ui/CLOSE_SNACKBAR")
    }
  }
}
</script>