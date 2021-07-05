<template>
  <div>
    <v-dialog v-model="showDialog" max-width="800px" close-delay="0" persistent>
      <!-- <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" class="mb-2" v-bind="attrs" v-on="on">
          Create New User
        </v-btn>
      </template> -->
      <v-card>
        <v-card-title>
          <span class="headline">{{ dialogHeader }}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="userData.firstName"
                  label="First Name"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="userData.lastName"
                  label="Last Name"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-select
                  v-model="userData.type"
                  label="User Type"
                  :items="types"
                  item-text="type"
                  item-value="type"
                  
                ></v-select>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="userData.userName"
                  label="User Name"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="userData.password"
                  label="Set Password"
                  type="password"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="userData.passwordConfirm"
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
    userData: {
      get() {
        return this.$store.state.ui.user.formItem
      // },
      // set() {
      //   if (this.$store.state.ui.user.formItem.id) {
      //     console.log("should be set")
      //     // const userData = this.$store.state.ui.user.formItem
      //     this.firstName = this.$store.state.ui.user.formItem.firstName,
      //     this.lastName = this.$store.state.ui.user.formItem.lastName,
      //     this.userName = this.$store.state.ui.user.formItem.userName,
      //     this.type = this.$store.state.ui.user.formItem.type
      //   }
      }
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
      password: '',
      passwordConfirm: '',
      userName: ''
    };
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.toggleDeleteDialog();
    },
  },

  methods: {
    close() {
      this.$store.commit("SET_USER_ADD_OR_EDIT_FORM", {})
      this.$store.commit("TOGGLE_USER_DIALOG")
      // this.$store.commit("toggleAppointmentDialog"); // first, close the dialog box, so user doesn't see us change the dialog type
      // this.$store.commit("initializeAppointment"); // next, set the appointment to be a blank one
    },
    deleteItemConfirm() {
      this.appointments.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    toggleDeleteDialog() {
      this.dialogDelete = !this.dialogDelete;
    },

    save() {
      this.$store.commit("saveAppointment");
      this.close();
    },
  },
};
</script>