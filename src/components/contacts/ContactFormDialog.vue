<template>
  <div>
    <v-dialog v-model="showDialog" max-width="800px" close-delay="0" persistent>
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" class="mb-2" v-bind="attrs" v-on="on">
          New Contact
        </v-btn>
      </template>

      <v-card :loading="loading">
        <v-card-title>
          <span class="headline">{{ dialogHeader }}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-form ref="contactForm">
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="firstName"
                    label="First Name"
                    :rules="textRules"
                    required
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-text-field
                    v-model="lastName"
                    label="Last Name"
                    :rules="textRules"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="address1"
                    label="Address Line 1"
                    :rules="addressRules"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="address2"
                    label="Address Line 2"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field v-model="city" label="City" :rules="textRules" required></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field v-model="state" label="State" :rules="textRules" required></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="postalCode"
                    label="Postal Code"
                    :rules="postalCodeRules"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field v-model="email" label="Email" :rules="emailRules" required></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="phoneNumber"
                    label="Phone Number"
                    :rules="phoneNumberRules"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="country"
                    label="Country"
                    :rules="textRules"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
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
      return this.$store.getters["contacts/contactId"]
        ? "Edit Contact"
        : "New Contact";
    },
    showDialog: {
      get() {
        return this.$store.getters["contacts/showDialog"];
      },
      set() {
        this.$store.commit("contacts/TOGGLE_CONTACTS_DIALOG", true);
      },
    },
    contact: {
      get() {
        return this.$store.getters["contacts/contact"];
      }
    },
    loading: {
      get() {
        return this.$store.getters['contacts/contactLoadingForEdit']
      }
    }
  },

  data() {
    return {
      firstName: '',
      lastName: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      phoneNumber: '',
      email: '',
      emailRules: [(v) => /.+@.+\..+/.test(v) || 'E-mail must be valid'],
      textRules: [
        (v) => !!v || "This field is required",
        (v) => /^([^0-9 ]*)$/.test(v) || 'Characters, spaces, and hyphens only in this field'
      ],
      phoneNumberRules: [
        (v) => !!v || "This field is required",
        (v) => /(\+?( |-|\.)?\d{1,2}( |-|\.)?)?(\(?\d{3}\)?|\d{3})( |-|\.)?(\d{3}( |-|\.)?\d{4})/.test(v) || 'Please enter a valid phone number'
      ],
      addressRules: [
        (v) => !!v || "This field is required",
        (v) => /[a-zA-Z]+[-]*[a-zA-Z]+/.test(v) || "Charaters, spaces, and dashes only in this field"
      ],
      cityStateRules: [
        (v) => !!v || "This field is required",
        (v) => /[a-zA-Z ]$/.test(v) || 'Characters and spaces only in this field'
      ],
      postalCodeRules: [
        (v) => !!v || "This field is required",
        (v) => /^[A-Z0-9-\s]+$/g.test(v) || "Uppercase charaters, spaces, dashes, and numbers only in this field"
      ]
    };
  },

  methods: {
    close() {
      this.firstName = '',
      this.lastName = '',
      this.address1 = '',
      this.address2 = '',
      this.city = '',
      this.state = '',
      this.postalCode = '',
      this.country = '',
      this.phoneNumber = '',
      this.email = '',
      this.$refs.contactForm.resetValidation()
      this.$store.commit('contacts/CLEAR_CONTACT')
      this.$store.commit("contacts/TOGGLE_CONTACTS_DIALOG", false);
    },

    save() {
      const contact = {
        firstName: this.firstName,
        lastName: this.lastName,
        address1: this.address1,
        address2: this.address2,
        city: this.city,
        state: this.state,
        postalCode: this.postalCode,
        country: this.country,
        phoneNumber: this.phoneNumber,
        email: this.email,
        userId: this.$store.getters['auth/userId']
      }
      if (this.$store.getters['contacts/contactId']) {
        this.$store.dispatch("contacts/saveExistingContact", contact)
      } else {
        this.$store.dispatch("contacts/saveNewContact", contact);
      }
      this.close();
    },
  },

  watch: {
    contact: function() {
      if (this.$store.getters['contacts/contactId']) {
        this.firstName = this.contact.firstName,
        this.lastName = this.contact.lastName,
        this.address1 = this.contact.address1,
        this.address2 = this.contact.address2,
        this.city = this.contact.city,
        this.state = this.contact.state,
        this.postalCode = this.contact.postalCode,
        this.country = this.contact.country,
        this.phoneNumber = this.contact.phoneNumber,
        this.email = this.contact.email
      }
    },

  }
};
</script>