<template>
  <v-sheet class="ma-6">
    <v-data-table
      :headers="headers"
      :items="reportItems"
      :items-per-page="5"
      class="elevation-1"
      :loading="loading"
      sort-by="lastName"
    >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Total Appointments By Contact</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>

        <v-spacer></v-spacer>
        <v-toolbar-title>Your Total Contacts: {{total}}</v-toolbar-title>
        
        <v-divider v-if="isManager" class="mx-4" inset vertical></v-divider>
        <v-spacer v-if="isManager"></v-spacer>
        <v-toolbar-title v-if="isManager">Total Contacts In System: {{totalAllContacts}}</v-toolbar-title>
      </v-toolbar>
    </template>
    <template v-slot:no-data>
      No contacts are registered
    </template>
    </v-data-table>
  </v-sheet>
</template>

<script>
export default {
  mounted() {
    this.contactTotals()
  },
  computed: {
    contacts() {
      return this.$store.getters['contacts/contacts']
    },
    appointments() {
      return this.$store.getters['appointments/appointments']
    },
    total() {
      return this.contacts.length
    },
    isManager() {
      return this.$store.getters['auth/userType'] === 'Manager'
    },
    totalAllContacts() {
      return this.$store.getters['contacts/allContacts'].length
    }
  },
  data() {
    return {
      headers: [
        {
          text: "Contact",
          align: "start",
          sortable: true,
          value: "contact",
        },
        {
          text: "Total",
          sortable: true,
          value: "total",
          align: 'center'
        },
      ],
      loading: false,
      reportItems: []
    };
  },
  methods: {
    contactTotals() {
      this.loading = true
      let results = []

      this.contacts.forEach(contact => {
        results.push({
          lastName: contact.lastName,
          contact: `${contact.firstName} ${contact.lastName}`,
          total: this.appointments.filter(x => x.contactId == contact.id).length
        })
      });

      this.loading = false
      this.reportItems = results
    }
  }
};
</script>