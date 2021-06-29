<template>
  <v-overlay :value="this.$store.state.ui.overlayActive">
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
</template>

<script>
export default {
  name: 'Overlay'
}
</script>