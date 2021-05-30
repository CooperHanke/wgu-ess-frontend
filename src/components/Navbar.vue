<template>
  <v-navigation-drawer app clipped permanent :mini-variant="mini">
    <v-list dense nav>
      <!-- using a regular list, giving out regular links first -->
      <v-list-item
        v-for="item in menuItems"
        :key="item.title"
        link
        @click="switchPageView(item)"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <!-- now, here we have the special reports menu -->
      <v-list-group prepend-icon="mdi-file-chart">
        <template v-slot:activator>
          <v-list-item-title>Reports</v-list-item-title>
        </template>

        <v-list-item
          v-for="item in reportItems"
          :key="item.title"
          link
          @click="switchPageView(item)"
        >
        <v-list-item-action>
              <v-icon>-</v-icon>
            </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>

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
      return this.$vuetify.breakpoint.mobile;
    },
    menuItems() {
      return this.items.filter((item) => !item.availableReports);
    },
    reportItems() {
      const reportItem = this.items.find((item) => item.availableReports);
      return reportItem.availableReports;
    },
  },
  data() {
    return {
      items: [
        { title: "Appointments", icon: "mdi-calendar" },
        { title: "Contacts", icon: "mdi-contacts" },
        {
          title: "Reports",
          icon: "mdi-file-chart",
          availableReports: [
            {
              title: "Report 1",
              location: "report1"
            },
            {
              title: "Report 2",
              location: "report2"
            },
            {
              title: "Report 3",
              location: "report3"
            },
          ],
        },
      ],
    };
  },
  methods: {
    switchPageView(item) {
      if (!item.location) {
        this.$store.commit("setActivePage", this.formatLink(item.title));
      } else {
        this.$store.commit("setActivePage", 'reports')
      }
    },
    formatLink(link) {
      return link.toLowerCase();
    },
  },
};
</script>

<style>
</style>