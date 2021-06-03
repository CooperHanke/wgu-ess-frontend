<template>
<div>
  <v-sheet class="ma-6">
    <v-data-table
      :headers="headers"
      :items="appointments"
      sort-by="startTime"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Upcoming Appointments</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>

          <appointment-form-dialog />

        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="editAppointment(item)"> mdi-pencil </v-icon>
        <v-icon small @click="deleteAppointment(item)"> mdi-delete </v-icon>
      </template>
      <template v-slot:no-data>
        No appointments are found
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
    dialogDelete: false,
    headers: [
      {
        text: "Contact Name",
        align: "start",
        sortable: false,
        value: "name",
      },
      { text: "Title", value: "title" },
      { text: "Description", value: "description" },
      { text: "Location", value: "location" },
      { text: "Type", value: "type" },
      { text: "Start Date", value: "startDate", sortable: false },
      { text: "Start Time", value: "startTime", sortable: false },
      { text: "End Date", value: "endDate", sortable: false },
      { text: "End Time", value: "endTime", sortable: false },
      { text: "Actions", value: "actions", sortable: false },
    ],
  }),

  computed: {
    appointments: {
      get() {
        return this.$store.state.appointments
      },
      set() {
        // this.$store.commit("")
      }
    },
    appointment: {
      get() {
        return this.$store.state.appointment
      },
      set(payload) {
        this.$store.commit("setAppointment", payload)
      }
    },
  },

  created() {
    this.initialize()
  },

  methods: {
    initialize() {
      this.$store.commit('initializeAppointments')
      this.appointments = this.$store.state.appointments
    },

    editAppointment(appointment) {
      const store = this.$store
      store.commit('setAppointment', appointment); // set the appointment in state
      store.commit('setAppointmentContact', appointment.name) // set the contact for the appointment in question
      store.commit('toggleAppointmentDialog')
    },

    deleteAppointment(appointment) {
      this.$store.commit('setAppointment', appointment)
      this.dialogDelete = true;
    },

    deleteAppointmentConfirm() {
      this.$store.commit('deleteAppointment')
      this.toggleDeleteDialog();
    },

    toggleDeleteDialog() {
      this.dialogDelete = !this.dialogDelete
    }
    
    // save() {
    //   if (this.editedIndex > -1) {
    //     Object.assign(this.appointments[this.editedIndex], this.editedItem);
    //   } else {
    //     this.appointments.push(this.editedItem);
    //   }
    //   this.close();
    // },
  },
};
</script>