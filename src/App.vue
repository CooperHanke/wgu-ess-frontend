<template>
  <v-app>
    <v-app-bar color="primary" app>
      <img class="wgu-icon" src="@/assets/wgu-logo.jpg" alt="wgu-logo"/>
      <v-toolbar-title class="white--text">WGU Enhanced Scheduling System</v-toolbar-title>
  </v-app-bar>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //
  }),
};
</script>

<style scoped>
  .wgu-icon {
    height: 30px;
    margin-right: 10px;
  }
</style>
