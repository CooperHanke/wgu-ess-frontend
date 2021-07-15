<template>
  <v-container>
    <v-alert
      text
      type="info"
      border="left"
      prominent
    >
      Welcome to the WGU Enhanced Scheduling System, @{{ userName }}! Choose any menu selection on the left to get started.
    </v-alert>
  </v-container>
</template>

<script>
export default {
  computed: {
    userName() {
      return this.$store.getters['auth/userName']
    }
  }
}
</script>