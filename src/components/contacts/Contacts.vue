<template>
  <div>
    <v-sheet class="ma-6">
      <v-data-table
        :headers="headers"
        :items="contacts"
        sort-by="name"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Contact List</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            
            <contact-form-dialog />

          </v-toolbar>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="editContact(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="deleteContact(item)"> mdi-delete </v-icon>
        </template>
        <template v-slot:no-data>
          No contacts are found
        </template>
      </v-data-table>
    </v-sheet>
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="headline"
          >Are you sure you want to delete this item?</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="deleteContactConfirm"
            >OK</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import ContactFormDialog from "@/components/contacts/ContactFormDialog.vue"
export default {
  components: {
    ContactFormDialog
  },
  data: () => ({
    dialogDelete: false,
    headers: [
      {
        text: "Name",
        align: "start",
        sortable: false,
        value: "name",
      },
      { text: "Address", value: "address1" },
      { text: "City", value: "city" },
      { text: "Phone Number", value: "phoneNumber" },
      { text: "Country", value: "country" },

      { text: "Actions", value: "actions", sortable: false },
    ],
  }),

  computed: {
    contacts: {
      get() {
        return this.$store.state.contacts
      },
      set() {
        this.$store.commit("updateContacts")
      }
    }
  },

  // watch: {
  //   dialog(val) {
  //     val || this.close();
  //   },
  //   dialogDelete(val) {
  //     val || this.closeDelete();
  //   },
  // },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      this.$store.commit('initializeContacts')
      this.contacts = this.$store.state.contacts
    },

    editContact(contact) {
      const store = this.$store
      store.commit('setContact', contact)
      store.commit('toggleContactDialog')
    },

    deleteContact(contact) {
      this.$store.commit('setContact', contact)
      console.log(contact.name)
      this.dialogDelete = true
    },

    deleteContactConfirm() {
      this.$store.commit('deleteContact')
      this.toggleDeleteDialog()
    },

    close() {
      this.$store.commit("toggleContactsDialog"); // first, close the dialog box, so user doesn't see us change the dialog type
      this.$store.commit("initializeContact"); // next, set the appointment to be a blank one
    },

    toggleDeleteDialog() {
      this.dialogDelete = !this.dialogDelete
    },

    closeDelete() {
      this.$store.commit("initializeContact");
      this.toggleDeleteDialog()
    },
  },
};
</script>