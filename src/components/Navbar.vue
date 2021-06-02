<template>
  <v-navigation-drawer app clipped permanent :mini-variant="mini">

    <user-menu-item />
    
    <v-list dense nav>
      <v-list-item-group mandatory>

        <!-- using a regular list, giving out regular links first -->
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          link
          @click="switchPageView(item)"
          color="primary"
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
            @click="switchReportView(item)"
          >
            <v-list-item-action>
              <v-icon></v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>

        <v-divider class="mx-4"></v-divider>
      </v-list-item-group>
    </v-list>

    <template v-slot:append>
      <div class="text-center pa-1" v-if="mini" @click="logout">
        <v-btn color="primary" rounded small>
          <v-icon> mdi-logout </v-icon>
        </v-btn>
      </div>
      <div class="pa-3" v-else>
        <v-btn block color="primary" @click="logout">
          <v-icon left> mdi-logout </v-icon>
          Logout
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script>
import UserMenuItem from '@/components/navbar/UserMenuItem.vue'
export default {
  components: {
    UserMenuItem
  },
  computed: {
    mini() {
      return this.$vuetify.breakpoint.mobile;
    },
    menuItems() {
      return this.items.filter((item) => !item.availableReports);
    },
    reportItems() {
      const reportItem = this.items.find((item) => item.availableReports);
      if (this.userType === "manager") {
        return reportItem.availableReports;
      } else {
        return reportItem.availableReports.filter(
          (r) => r.userGroup === this.userType
        );
      }
    },
    userType() {
      return this.$store.state.user.type;
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
              title: "Appointments By Month",
              location: "appointments-by-month",
              userGroup: "standard",
            },
            {
              title: "Total Appointments By Contact",
              location: "total-appointments-by-contact",
              userGroup: "standard",
            },
            {
              title: "User Schedules",
              location: "user-schedules",
              userGroup: "manager",
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
      } else return;
    },
    switchReportView(item) {
      if (item.location) {
        this.$store.commit("setActivePage", "reports");
        this.$store.commit("setReportPage", item.location);
      } else return;
    },
    formatLink(link) {
      return link.toLowerCase();
    },
    logout() {
      this.$store.commit("logout");
      this.$vuetify.theme.dark = false; // have to reset the theme manually, as store doesn't have access to itS
      this.$router.push({ name: "Login" });
    },
    changePassword() {
      this.$data.changePassword = !this.$data.changePassword
      console.log('would have changed the password')
    }
  },
};
</script>

<style>
</style>