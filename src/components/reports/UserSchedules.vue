<template>
  <v-sheet class="ma-6">
    <v-data-table
      :headers="headers"
      :items="reportItems"
      :items-per-page="15"
      class="elevation-1"
      :loading="loading"
      sort-by="startDate"
      :custom-sort="customSort"
      :sort-desc.sync="sortDesc"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>User Schedules</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-toolbar-title>Total Registered Users: {{total}}</v-toolbar-title>
        </v-toolbar>
      </template>
    </v-data-table>
  </v-sheet>
</template>

<script>
export default {
  mounted() {
    this.$store.dispatch('users/loadUsers')
    this.$store.dispatch('contacts/loadAllContacts')
    this.$store.dispatch('appointments/loadAllAppointments')
    this.generateData()
  },
  computed: {
    allAppointments: {
      get() {
        return this.$store.getters['appointments/allAppointments']
      }
    },
    allContacts: {
      get() {
        return this.$store.getters['contacts/allContacts']
      }
    },
    allUsers: {
      get() {
        return this.$store.getters['users/users']
      }
    },
    total() {
      return this.allUsers.length
    }
  },
  data() {
    return {
      headers: [
        {
          text: "User",
          align: "start",
          sortable: true,
          value: "user",
        },
        {
          text: "Contact",
          sortable: true,
          value: "name",
        },
        {
          text: "Appointment Start",
          value: "startDate",
          sortable: true,
          filterable: true,
        },
        {
          text: "Appointment End",
          value: "endDate",
          sortable: true,
          filterable: true,
        },
      ],
      loading: false,
      reportItems: [],
      sortDesc: true
    };
  },
  methods: {
    generateData() {
      this.loading = true
      const users = this.allUsers
      const contacts = this.allContacts
      const appointments = this.allAppointments

      let results = []
      appointments.forEach(appointment => {
        const user = users.find(x => x.id === appointment.userId)
        const contact = contacts.find(x => x.id === appointment.contactId)
        results.push({
          user: `${user.firstName} ${user.lastName}`,
          name: `${contact.firstName} ${contact.lastName}`,
          startDate: appointment.startDateTimeDisplay,
          endDate: appointment.endDateTimeDisplay
        })
      });

      this.reportItems = results
      this.loading = false
    },
    customSort(items, index, isDesc) {
      items.sort((a, b) => {
        if (index[0] === 'startDate' || index[0] === 'endDate') {
          if (!isDesc[0]) {
              return new Date(b[index]) - new Date(a[index]);
          } else {
              return new Date(a[index]) - new Date(b[index]);
          }
        }
        else {
          if(typeof a[index] !== 'undefined'){
            if (!isDesc[0]) {
                return a[index].toLowerCase().localeCompare(b[index].toLowerCase());
            }
            else {
                return b[index].toLowerCase().localeCompare(a[index].toLowerCase());
            }
          }
        }
      });
      return items;
    }
  },
  // even though watchers are expensive, we need to ensure we have all the data, and the best way is to watch that we have the data
  // if we are missing any, the watchers will catch this, and then once all data comes, force refresh of the data
  watch: {
    allContacts: function() {
      if (this.allContacts.length > -1) {
        this.generateData()
      }
    },
    allAppointments: function() {
      if (this.allAppointments.length > -1) {
        this.generateData()
      }
    },
    allUsers: function() {
      if (this.allUsers.length > -1) {
        this.generateData()
      }
    }
  }
};
</script>