<template>
  <v-app>
    <v-overlay :value="this.$store.state.ui.overlayActive">
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
    <v-app-bar color="primary" app clipped-left>
      <img class="wgu-icon" src="@/assets/wgu-logo.jpg" alt="wgu-logo"/>
      <v-toolbar-title class="white--text" v-show="!isMobile"> WGU Enhanced Scheduling System</v-toolbar-title>
      <v-spacer></v-spacer>
      <reminders v-if="loggedIn" />
  </v-app-bar>
      <router-view/>
  </v-app>
</template>

<script>
import Reminders from '@/components/reminders/Reminders.vue'
export default {
  name: 'App',
  components: {
    Reminders
  },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.mobile
    },
    username() {
      return this.$store.state.user.username
    },
    loggedIn() {
      return this.$store.state.auth.userId !== null
    }
  }
};
</script>

<style scoped>
  .wgu-icon {
    height: 30px;
    margin-right: 10px;
  }
</style>
