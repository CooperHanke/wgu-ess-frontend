<template>
  <div>
    <v-sheet class="ma-6">
      <v-data-table
        :headers="headers"
        :items="contacts"
        sort-by="name"
        class="elevation-1"
        :loading="loading"
        loading-text="Loading... Please wait"
        :search="search"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Contacts</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>

          <v-text-field
            v-model="search"
            clearable
            single-line
            hide-details
            prepend-inner-icon="mdi-magnify"
            label="Search contacts by first or last name..."
          ></v-text-field>

            <v-spacer></v-spacer>
            
            <contact-form-dialog />

          </v-toolbar>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="editContact(item.id)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="deleteContact(item.id)"> mdi-delete </v-icon>
        </template>
        <template v-slot:no-data>
          No contacts are found
        </template>
      </v-data-table>
    </v-sheet>

    <v-dialog v-model="dialogDelete" max-width="600px">
      <v-card>
        <v-card-title class="headline"
          >Are you sure you want to delete {{ contactName }}?</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="deleteConfirm"
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
        text: "First Name",
        align: "start",
        value: "firstName",
      },
      { text: "Last Name", value: "lastName" },
      { text: "Address", value: "address1", sortable: false  },
      { text: "City", value: "city", sortable: false  },
      { text: "Phone Number", value: "phoneNumber", sortable: false  },
      { text: "Email", value: "email", sortable: false  },
      { text: "Country", value: "country", sortable: false  },

      { text: "Actions", value: "actions", sortable: false },
    ],
    search: ''
  }),

  computed: {
    contacts: {
      get() {
        return this.$store.getters['contacts/contacts']
      },
      set() {
        this.$store.dispatch('contacts/loadContactsByLoggedInUser')
      },
    },
    loading() {
      return this.$store.getters['contacts/contactsLoading']
    },
    contactName() {
      return this.$store.getters['contacts/contactFullName']
    }
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      this.$store.dispatch('contacts/loadContactsByLoggedInUser')
    },

    editContact(contactId) {
      const store = this.$store
      store.dispatch('contacts/setContact', contactId)
      store.commit('contacts/TOGGLE_CONTACTS_DIALOG', true)
    },

    deleteContact(contactId) {
      this.$store.dispatch('contacts/setContact', contactId)
      this.dialogDelete = true
    },

    close() {
      this.$store.commit("toggleContactsDialog"); // first, close the dialog box, so user doesn't see us change the dialog type
      this.$store.commit("initializeContact"); // next, set the appointment to be a blank one
    },

    toggleDeleteDialog() {
      this.dialogDelete = !this.dialogDelete
    },

    closeDelete() {
      this.$store.commit("contacts/CLEAR_CONTACT");
      this.dialogDelete = !this.dialogDelete
    },

    deleteConfirm() {
      this.$store.dispatch('contacts/deleteContact')
      this.dialogDelete = !this.dialogDelete
    },
  },
};
</script>