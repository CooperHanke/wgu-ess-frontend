<template>
  <v-app>
    <v-app-bar color="primary" app clipped-left>
      <img class="wgu-icon" src="@/assets/wgu-logo.jpg" alt="wgu-logo"/>
      <v-toolbar-title class="white--text">WGU Enhanced Scheduling System</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-title v-show="this.$store.state.user.isAuthenticated" class="white--text">{{ username }}</v-toolbar-title>
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
