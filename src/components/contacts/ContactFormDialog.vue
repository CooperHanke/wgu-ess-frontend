<template>
  <div>
    <v-dialog v-model="showDialog" max-width="800px" close-delay="0" persistent>
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" class="mb-2" v-bind="attrs" v-on="on">
          New Contact
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">{{ dialogHeader }}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col>
                <v-text-field
                  v-model="contact.name"
                  label="Name"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field
                  v-model="contact.address1"
                  label="Address"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field
                  v-model="contact.address2"
                  label="Address Line"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="contact.city"
                  label="City"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="contact.state"
                  label="State"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="contact.postalCode"
                  label="Postal Code"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="contact.phoneNumber"
                  label="Phone Number"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="contact.country"
                  label="Country"
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
      return this.$store.state.contact.data.id > -1
        ? "Edit Contact"
        : "New Contact";
    },
    showDialog: {
      get() {
        return this.$store.state.contact.showDialog;
      },
      set() {
        this.$store.commit("toggleContactDialog");
      },
    },

    contact: {
      get() {
        return this.$store.state.contact.data;
      }
    },
  },

  methods: {
    close() {
      this.$store.commit("toggleContactDialog"); // first, close the dialog box, so user doesn't see us change the dialog type
      this.$store.commit("initializeContact"); // next, set the appointment to be a blank one
    },

    save() {
      this.$store.commit("saveContact");
      this.close();
    }
  }
}
</script>