<template>
  <div>
    <v-dialog v-model="showDialog" max-width="800px" close-delay="0" persistent>
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" class="mb-2" v-bind="attrs" v-on="on">
          Create New User
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">{{ dialogHeader }}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="user.firstName"
                  label="First Name"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="user.lastName"
                  label="Last Name"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-select
                  v-model="user.userType"
                  label="User Type"
                  :items="types"
                  item-text="user.userType"
                  item-value="user.userType"
                ></v-select>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="user.userName"
                  label="User Name"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="user.password"
                  label="Set Password"
                  type="password"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="user.passwordConfirm"
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
    dialogHeader() {
      return this.$store.state.appointment.data.id > -1
        ? "Edit User"
        : "New User";
    },
    showDialog: {
      get() {
        return this.$store.state.appointment.showDialog;
      },
      set() {
        this.$store.commit("toggleUserDialog");
      },
    }
  },

  data() {
    return {
      dialogDelete: false,
      types: ['Standard', 'Manager'],
      user: {
        firstName: '',
        lastName: '',
        userType: '',
        password: '',
        passwordConfirm: '',
        userName: ''
      }
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