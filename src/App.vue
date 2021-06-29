<template>
  <v-app>
    <overlay />
    <snackbar />
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
import Overlay from '@/components/ui/Overlay.vue'
import Snackbar from '@/components/ui/Snackbar.vue'

export default {
  name: 'App',
  components: {
    Reminders,
    Overlay,
    Snackbar
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
  },
  watch: {
    '$store.state.user.usesDarkMode': function() {
      this.$vuetify.theme.dark = this.$store.state.user.usesDarkMode
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
