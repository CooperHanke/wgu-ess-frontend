<template>
  <v-app>
    <v-app-bar color="primary" app clipped-left>
      <img class="wgu-icon" src="@/assets/wgu-logo.jpg" alt="wgu-logo"/>
      <v-toolbar-title class="white--text" v-show="!isMobile"> WGU Enhanced Scheduling System</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn v-show="this.$store.state.user.isAuthenticated" icon class="white--text">
        <v-icon>mdi-bell-outline</v-icon>
      </v-btn>
  </v-app-bar>
      <router-view/>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  computed: {
    isMobile: {
      get() {
        return this.$vuetify.breakpoint.mobile
      }
    },
    username: {
      get() {
        return this.$store.state.user.username
      }
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
