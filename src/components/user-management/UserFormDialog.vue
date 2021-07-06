<template>
  <div>
    <v-dialog v-model="showDialog" max-width="800px" close-delay="0" persistent>
      <v-card>
        <v-card-title>
          <span class="headline">{{ dialogHeader }}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="firstName"
                  label="First Name"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="lastName"
                  label="Last Name"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-select
                  v-model="type"
                  label="User Type"
                  :items="types"
                  item-text="type"
                  item-value="type"
                  
                ></v-select>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="userName"
                  label="User Name"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  :disabled="this.sameUser"
                  v-model="password"
                  label="Set Password"
                  type="password"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  :disabled="this.sameUser"
                  v-model="passwordConfirm"
                  label="Confirm Password"
                  type="password"
                ></v-text-field>
              </v-col>

            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
          <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  computed: {
    userData() {
      return this.$store.state.ui.user.formItem
    },
    sameUser() {
      return this.$store.state.ui.user.formItem.id === this.$store.state.auth.userId
    },
    dialogHeader() {
      return this.$store.state.ui.user.formItem.id
        ? "Edit User"
        : "New User";
    },
    showDialog: {
      get() {
        return this.$store.state.ui.user.showDialog
      },
      set() {
        this.$store.commit("TOGGLE_USER_DIALOG")
      },
    }
  },

  data() {
    return {
      dialogDelete: false,
      types: ['Standard', 'Manager'],
      firstName: '',
      lastName: '',
      type: '',
      userName: '',
      password: '',
      passwordConfirm: '',
    };
  },

  methods: {
    close() {
      this.$store.commit("CLEAR_USER_FORM_DATA")
      this.clearFormEntries()
      this.$store.commit("TOGGLE_USER_DIALOG")
    },
    deleteItemConfirm() {
      this.appointments.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    toggleDeleteDialog() {
      this.dialogDelete = !this.dialogDelete;
    },

    save() {
      if (this.userData.id !== "") {
        const id = this.$store.state.ui.user.formItem.id
        const editedUserData = {
          id,
          firstName: this.firstName,
          lastName: this.lastName,
          type: this.type,
          userName: this.userName,
          isLocked: this.userData.isLocked,
          needPasswordReset: this.userData.needPasswordReset
        }
        if (this.validPassword()) {
          editedUserData.password = this.password
        } else {
          delete editedUserData.password
        }
        this.$store.dispatch("editUserSubmit", editedUserData)
      } else {
        const newUserData = {
          firstName: this.firstName,
          lastName: this.lastName,
          type: this.type,
          userName: this.userName,
          password: this.password,
        }
        this.$store.dispatch("newUserSubmit", newUserData)
      }
      this.close();
    },

    validPassword() {
      return (this.password !== '' && this.passwordConfirm !== '') && (this.password == this.passwordConfirm)
    },

    clearFormEntries() {
      this.firstName = ''
      this.lastName = ''
      this.userName = ''
      this.type = ''
      this.password = ''
      this.passwordConfirm = ''
    }
  },

  watch: {
    "$store.state.ui.user.formItem": function() {
      if (this.$store.state.ui.user.formItem.id !== '') {
        this.firstName = this.$store.state.ui.user.formItem.firstName
        this.lastName = this.$store.state.ui.user.formItem.lastName
        this.type = this.$store.state.ui.user.formItem.type
        this.userName = this.$store.state.ui.user.formItem.userName
      }
    },
  }
};
</script>