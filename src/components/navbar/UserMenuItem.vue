<template>
  <div>
    <!-- dialog for changing password for logged in user -->
    <v-dialog v-model="dialogChangePassword" max-width="600px" persistent>
      <v-card>
        <v-card-title>Change Password for {{ userName }} </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="passwordChangeForm" v-model="valid">
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="password"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="passwordRules"
                    :type="showPassword ? 'text' : 'password'"
                    label="New Password"
                    required
                    counter
                    @click:append="showPassword = !showPassword"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="passwordConfirm"
                    :append-icon="showPasswordConfirm ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="confirmPasswordRules"
                    :type="showPasswordConfirm ? 'text' : 'password'"
                    label="Confirm New Password"
                    required
                    counter
                    @click:append="showPasswordConfirm = !showPasswordConfirm"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
            <small>Changing this password will log you out automatically once the change is confirmed</small>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cancelChangePassword">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="submitNewPassword" :disabled="!valid">Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  <!-- this is the menu that is activated by the cog -->
  <v-list-item>
    <v-list-item-content>
      <v-list-item-title class="text-h6"> {{ firstName }} {{ lastName }} </v-list-item-title>
      <v-list-item-subtitle>{{ userName }}</v-list-item-subtitle>
    </v-list-item-content>

    <v-menu
      nudge-right="20"
      nudge-bottom="20"
      v-model="settingsMenu"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on">
          <v-icon>mdi-cog</v-icon>
        </v-btn>
      </template>

      <v-card>
        <v-list>
          <v-list-item>
              <v-switch 
                v-model="usesDarkMode"
                label="Enable dark mode"
                @click="toggleDarkMode"
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
  </div>
</template>

<script>
export default {
  computed: {
    firstName() {
      return this.$store.getters['auth/firstName']
    }, // getters for username,
    lastName() {
      return this.$store.getters['auth/lastName']
    },
    userName() {
      return `@${this.$store.getters['auth/userName']}`
    },
    confirmPasswordRules() {
      return [(this.password === this.passwordConfirm) || "Passwords must match"]
    },
    usesDarkMode() {
      return this.$store.getters['auth/usesDarkMode']
    }
  },
  data() {
    return {
      settingsMenu: false,
      dialogChangePassword: false,
      password: '',
      passwordConfirm: '',
      passwordRules: [
        (v) => /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm.test(v) || "Must be at least 8 characters, and contain at least 1 lowercase letter, one uppercase letter, and a number. May contain special characters",
      ],
      showPassword: false,
      showPasswordConfirm: false,
      valid: false
    }
  },
  methods: {
    changePassword() {
      this.settingsMenu = false,
      this.dialogChangePassword = true
    },
    toggleDarkMode() {
      this.$store.dispatch("users/toggleDarkMode")
    },
    cancelChangePassword() {
      this.dialogChangePassword = false,
      this.password = '',
      this.passwordConfirm = ''
      this.$refs.passwordChangeForm.resetValidation()
    },
    submitNewPassword() {
      if (this.password === this.passwordConfirm) {
        this.$store.dispatch("users/changeUserPassword", this.password)
        this.$vuetify.theme.dark = false; // have to reset the theme manually, as store doesn't have access to it
      } else return
    }
  }
};
</script>