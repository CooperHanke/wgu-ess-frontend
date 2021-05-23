<template>
  <v-navigation-drawer app clipped permanent :mini-variant="mini">
    <v-list dense nav>
      <v-list-item v-for="item in items" :key="item.title" link @click="switchPageView(item.title)">
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider class="mx-4"></v-divider>
    </v-list>

    <template v-slot:append>
      <div class="text-center pa-1" v-if="mini">
        <v-btn color="primary" rounded small>
          <v-icon> mdi-logout </v-icon>
        </v-btn>
      </div>
      <div class="pa-3" v-else>
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
  computed: {
    mini() {
      return this.$vuetify.breakpoint.mobile
    }
  },
  data() {
    return {
      items: [
        { title: "Appointments", icon: "mdi-calendar" },
        { title: "Contacts", icon: "mdi-contacts" },
        { title: "Reports", icon: "mdi-file-chart" },
      ],
      reportTypes: [
        {
          title: "test"
        }
      ]
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