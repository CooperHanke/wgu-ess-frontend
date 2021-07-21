<template>
  <div>
    <v-dialog v-model="showDialog" max-width="800px" close-delay="0" persistent>
      <v-card :loading="loading">
        <v-card-title>
          <span class="headline" v-show="!loading">{{ dialogHeader }}</span>
        </v-card-title>

        <v-card-text>
          <v-form ref="userForm" v-model="valid">
            <v-container>
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="firstName"
                    label="First Name"
                    :rules="textRules"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="lastName"
                    label="Last Name"
                    :rules="textRules"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6" md="4">
                  <v-select
                    v-model="type"
                    label="User Type"
                    :items="types"
                    item-text="type"
                    item-value="type"
                    :rules="textRules"
                  ></v-select>
                </v-col>

                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="userName"
                    label="User Name"
                    :rules="textRules"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-if="!this.sameUser"
                    v-model="password"
                    label="Set Password"
                    type="password"
                    :rules="passwordRules"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-if="!this.sameUser"
                    v-model="passwordConfirm"
                    label="Confirm Password"
                    type="password"
                    :rules="confirmPasswordRules"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
          <v-btn color="blue darken-1" text @click="save" :disabled="!valid">
            Save
          </v-btn>
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
        return this.$store.getters["users/user"];
      },
    },
    sameUser() {
      return (
        this.$store.getters["users/userId"] ===
        this.$store.getters["auth/userId"]
      );
    },
    dialogHeader() {
      return this.$store.getters["users/userId"] ? "Edit User" : "New User";
    },
    showDialog: {
      get() {
        return this.$store.getters["users/showUserForm"];
      },
      set() {
        this.$store.commit("users/TOGGLE_USER_DIALOG");
      },
    },
    passwordRules() {
      const rules = [
        (v) => /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm.test(v) || "Must be at least 8 characters, and contain at least 1 lowercase letter, one uppercase letter, and a number. May contain special characters",
      ];
      if (!this.$store.getters["users/userId"]) {
        return rules;
      } else if (
        this.$store.getters["users/userId"] &&
        this.password === "" &&
        this.passwordConfirm === ""
      ) {
        return [];
      } else {
        return rules;
      }
    },
    confirmPasswordRules() {
      if (!this.$store.getters["users/userId"]) {
        return [(this.password === this.passwordConfirm) || "Passwords must match"]
      } else if (this.$store.getters["users/userId"] && this.password !== '') {
        return [(this.password === this.passwordConfirm) || "Passwords must match"]
      } else return []
    },
    formData() {
      return this.$store.getters["users/user"];
    },
    loading: {
      get() {
        return this.$store.getters["users/editUserLoadingState"];
      },
    }
  },

  data() {
    return {
      dialogDelete: false,
      types: ["Standard", "Manager"],
      firstName: "",
      lastName: "",
      type: "",
      userName: "",
      password: "",
      passwordConfirm: "",
      textRules: [(v) => !!v || "Required"],
      valid: true,
    };
  },

  methods: {
    close() {
      this.$store.commit("users/CLEAR_USER_FORM_DATA");
      this.clearFormEntries();
      this.$refs.userForm.resetValidation();
      this.$store.commit("users/TOGGLE_USER_DIALOG");
    },
    toggleDeleteDialog() {
      this.dialogDelete = !this.dialogDelete;
    },
    save() {
      this.$refs.userForm.validate();
      if (this.userData.id) {
        const id = this.$store.getters["users/userId"];
        const editedUserData = {
          id,
          firstName: this.firstName,
          lastName: this.lastName,
          type: this.type,
          userName: this.userName,
          isLocked: this.userData.isLocked,
          needPasswordReset: this.userData.needPasswordReset,
          usesDarkMode: this.userData.usesDarkMode
        };
        if (this.validPassword()) {
          editedUserData.password = this.password;
        } else {
          delete editedUserData.password;
        }
        this.$store.dispatch("users/editUserSubmit", editedUserData);
      } else {
        const newUserData = {
          firstName: this.firstName,
          lastName: this.lastName,
          type: this.type,
          userName: this.userName,
          password: this.password,
        };
        this.$store.dispatch("users/newUserSubmit", newUserData);
      }
      this.close();
    },
    validPassword() {
      return (
        this.password !== "" &&
        this.passwordConfirm !== "" &&
        this.password == this.passwordConfirm
      );
    },
    clearFormEntries() {
      this.firstName = "";
      this.lastName = "";
      this.userName = "";
      this.type = "";
      this.password = "";
      this.passwordConfirm = "";
    },
  },

  watch: {
    formData: function () {
      if (this.$store.getters["users/user"] !== "") {
        this.firstName = this.userData.firstName;
        this.lastName = this.userData.lastName;
        this.type = this.userData.type;
        this.userName = this.userData.userName;
      }
    },
  },
};
</script>