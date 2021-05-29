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
          <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="initialize"> Reset </v-btn>
        </template>
      </v-data-table>
    </v-sheet>
  </div>
</template>

<script>
import ContactFormDialog from "@/components/ContactFormDialog.vue"
export default {
  components: {
    ContactFormDialog
  },
  data: () => ({
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

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

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

    deleteItem(item) {
      this.editedIndex = this.contacts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.contacts.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    close() {
      this.$store.commit("toggleContactsDialog"); // first, close the dialog box, so user doesn't see us change the dialog type
      this.$store.commit("initializeContact"); // next, set the appointment to be a blank one
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
  },
};
</script>

<style>
</style>