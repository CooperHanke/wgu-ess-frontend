<template>
<div>
  <v-sheet class="ma-6">
    <v-data-table
      :headers="headers"
      :items="appointments"
      sort-by="startTime"
      class="elevation-1"
      :loading="loading"
      loading-text="Loading... Please wait"
      :search="search"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Upcoming Appointments</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>

          <v-text-field
            v-model="search"
            clearable
            single-line
            hide-details
            prepend-inner-icon="mdi-magnify"
            label="Search appointments..."
          ></v-text-field>

          <v-spacer></v-spacer>

          <appointment-form-dialog />

        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="editAppointment(item.id)"> mdi-pencil </v-icon>
        <v-icon small @click="deleteAppointment(item)"> mdi-delete </v-icon>
      </template>
      <template v-slot:no-data>
        No appointments are found
      </template>
    </v-data-table>
  </v-sheet>

  <v-dialog v-model="dialogDelete" max-width="800px">
      <v-card>
        <v-card-title class="headline"
          >Are you sure you want to delete the appointment with {{ contactName }}?</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="toggleDeleteDialog">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="deleteAppointmentConfirm"
            >OK</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    </div>
</template>

<script>
import AppointmentFormDialog from "@/components/appointments/AppointmentFormDialog.vue"
export default {
  components: {
    AppointmentFormDialog
  },
  data: () => ({
    contactName: '',
    dialogDelete: false,
    headers: [
      {
        text: "Contact Name",
        align: "start",
        sortable: true,
        value: "name",
      },
      { text: "Title", value: "title", sortable: true, filterable: true },
      { text: "Description", value: "description" },
      { text: "Location", value: "location", sortable: true, filterable: true },
      { text: "Type", value: "type", sortable: true },
      { text: "Start Date", value: "startDate", sortable: false, filterable: false },
      { text: "Start Time", value: "startTime", sortable: false, filterable: false },
      { text: "End Date", value: "endDate", sortable: true, filterable: false },
      { text: "End Time", value: "endTime", sortable: true, filterable: false },
      { text: "Actions", value: "actions", sortable: false, filterable: false },
    ],
    search: ''
  }),

  computed: {
    appointments: {
      get() {
        return this.$store.getters['appointments/appointments']
      },
      set() {
        this.$store.dispatch('appointments/loadAppointmentsByLoggedInUser')
      },
    },
    loading() {
      return this.$store.getters['appointments/appointmentsLoading']
    }
  },

  created() {
    this.initialize()
  },

  methods: {
    initialize() {
      this.$store.dispatch('appointments/loadAppointmentsByLoggedInUser')
    },

    editAppointment(appointmentId) {
      const store = this.$store
      store.dispatch('appointments/setAppointment', appointmentId)
      store.commit('appointments/TOGGLE_APPOINTMENTS_DIALOG', true)
    },

    deleteAppointment(appointment) {
      this.contactName = appointment.name
      this.$store.dispatch('appointments/setAppointment', appointment.id)
      this.dialogDelete = true;
    },

    deleteAppointmentConfirm() {
      this.$store.commit('deleteAppointment')
      this.contactName = ''
      this.toggleDeleteDialog();
    },

    toggleDeleteDialog() {
      this.contactName = ''
      this.dialogDelete = !this.dialogDelete
    }
  },
};
</script>