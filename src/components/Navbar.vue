<template>
  <v-navigation-drawer app clipped>
    <v-list dense nav>
      <v-list-item v-for="item in items" :key="item.title" link @click="switchPageView(item.title)">
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <template v-slot:append>
      <div class="pa-3">
        <v-btn block color="primary">
          <v-icon left> mdi-logout </v-icon>
          Logout
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script>
export default {
  data() {
    return {
      items: [
        { title: "Appointments", icon: "mdi-calendar" },
        { title: "Contacts", icon: "mdi-contacts" },
        { title: "Reports", icon: "mdi-file-chart" },
      ],
    };
  },
  methods: {
    switchPageView(page) {
      this.$store.commit('setActivePage', this.formatLink(page))
    },
    formatLink(link) {
      return link.toLowerCase()
    }
  },
};
</script>

<style>
</style>