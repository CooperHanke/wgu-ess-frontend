<template>
  <!-- this is the menu that is activated by the cog -->
  <v-list-item>
    <v-list-item-content>
      <v-list-item-title class="text-h6"> Test Dummy </v-list-item-title>
      <v-list-item-subtitle>@test-user</v-list-item-subtitle>
    </v-list-item-content>

    <v-menu
      nudge-right="20"
      nudge-bottom="20"
      v-model="settingsMenu"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on">
          <!-- activator goes into menu slot here -->
          <v-icon>mdi-cog</v-icon>
        </v-btn>
      </template>

      <v-card>
        <v-list>
          <v-list-item>
              <v-switch 
                v-model="darkMode"
                label="Enable dark mode"
              >
              </v-switch>
          </v-list-item>

          <v-list-item @click="changePassword">
            <v-list-item-title>Change Password</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
  </v-list-item>
</template>

<script>
export default {
  data() {
    return {
      settingsMenu: false
    }
  },
  computed: {
    darkMode: {
      get() {
        return this.$store.state.user.usesDarkMode
      },
      set() {
        this.$store.commit("TOGGLE_DARK_MODE")
        this.$vuetify.theme.dark = this.$store.state.user.usesDarkMode
      }
    }
  },
  methods: {
    changePassword() {
      this.$data.settingsMenu = false
    }
  }
};
</script>