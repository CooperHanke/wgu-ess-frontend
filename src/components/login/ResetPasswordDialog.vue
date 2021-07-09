<template>
  <v-dialog
      transition="dialog-top-transition"
      v-model="resetPasswordDialog"
      width="400"
      persistent
    >
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Reset Password
        </v-card-title>

        <v-card-text>
          Please fill out this form with your correct first name, last name, and username that you log in with
          <v-form>
            <v-text-field
              v-model="firstName"
              label="First Name"
              required
              :rules="rules"
            ></v-text-field>

            <v-text-field
              v-model="lastName"
              label="Last Name"
              required
              :rules="rules"
            ></v-text-field>

            <v-text-field
              v-model="userName"
              label="User Name"
              required
            ></v-text-field>
          </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue" text @click="close">Cancel</v-btn>
          <v-btn color="blue" text @click="submit" :disabled="!valid">Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
export default {
  computed: {
    resetPasswordDialog() {
      return this.$store.getters['auth/resetPasswordDialog']
    }
  },
  data() {
    return {
      firstName: '',
      lastName: '',
      userName: '',
      rules: [
        v => v.length >= 8 || 'Minimum 8 characters',
        (this.password == this.passwordConfirm) || 'Passwords do not match'
      ],
      valid: true
    }
  },
  methods: {
    close() {
      this.$store.dispatch("auth/clearPasswordResetDialog")
    },
    submit() {
      const fields = {
        firstName: this.firstName,
        lastName: this.lastName,
        userName: this.userName
      }
      this.$store.dispatch("auth/submitPasswordResetRequest", fields)
    }
  }
}
</script>

<style>

</style>