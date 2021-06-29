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

      </v-list-item-group>
    </v-list>

    <v-divider class="mx-4"></v-divider>

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
      if (this.userType === 'Manager') {
        return this.items.filter((item) => !item.availableReports);
      } else if (this.userType === 'Standard') {
        return this.items.filter((item) => !item.availableReports && item.userGroup !== 'Manager')
      } else return null
    },
    reportItems() {
      const reportItem = this.items.find((item) => item.availableReports);
      if (this.userType === "Manager") {
        return reportItem.availableReports;
      } else {
        return reportItem.availableReports.filter(
          (r) => r.userGroup === this.userType
        );
      }
    },
    userType() {
      return this.$store.state.user.type;
    }
  },
  data() {
    return {
      items: [
        { title: "Appointments", icon: "mdi-calendar", userGroup: "Standard" },
        { title: "Contacts", icon: "mdi-contacts", userGroup: "Standard" },
        { title: "User Management", icon: "mdi-account-supervisor-circle", userGroup: "Manager" },
        {
          title: "Reports",
          icon: "mdi-file-chart",
          availableReports: [
            {
              title: "Appointments By Month",
              location: "appointments-by-month",
              userGroup: "Standard",
            },
            {
              title: "Appointments By Contact",
              location: "total-appointments-by-contact",
              userGroup: "Standard",
            },
            {
              title: "User Schedules",
              location: "user-schedules",
              userGroup: "Manager",
            }
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
      let temp = link
      return temp.replace(/\s+/g, '-').toLowerCase();
    },
    logout() {
      this.$store.dispatch("logoutUser");
      this.$vuetify.theme.dark = false; // have to reset the theme manually, as store doesn't have access to it
      this.$router.push({ name: "Login" });
    },
    changePassword() {
      this.$data.changePassword = !this.$data.changePassword
      console.log('would have changed the password')
    }
  },
};
</script>