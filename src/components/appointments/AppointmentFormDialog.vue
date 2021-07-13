<template>
  <div>
    <v-dialog v-model="showDialog" max-width="800px" close-delay="0" persistent>
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" class="mb-2" v-bind="attrs" v-on="on">
          New Appointment
        </v-btn>
      </template>

      <v-card :loading="loading">
        <v-card-title>
          <span class="headline">{{ dialogHeader }}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-form ref="appointmentForm">
              <v-row>
                <v-col cols="6">
                  <v-text-field v-model="title" label="Title"></v-text-field>
                </v-col>

                <v-col cols="6">
                  <contact-selection-for-appointments />
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="description"
                    label="Description"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="location"
                    label="Location"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6" md="4">
                  <v-text-field v-model="type" label="Type"></v-text-field>
                </v-col>

                <v-col cols="12" sm="6" md="4">
                  <v-text-field v-model="url" label="URL"></v-text-field>
                </v-col>

                <v-col cols="6">
                  <v-menu
                    v-model="startDatePicker"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="startDate"
                        label="Start Date"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="startDate"
                      no-title
                      @input="toggleStartDatePicker"
                    ></v-date-picker>
                  </v-menu>
                </v-col>

                <v-col cols="6">
                  <v-text-field
                    v-model="startTime"
                    label="Start Time"
                    type="time"
                  ></v-text-field>
                </v-col>

                <v-col cols="6">
                  <v-menu
                    v-model="endDatePicker"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="endDate"
                        label="Ending Date"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="endDate"
                      no-title
                      @input="toggleEndDatePicker"
                    ></v-date-picker>
                  </v-menu>
                </v-col>

                <v-col cols="6">
                  <v-text-field
                    v-model="endTime"
                    label="End Time"
                    type="time"
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
import ContactSelectionForAppointments from "@/components/appointments/ContactSelectionForAppointments.vue";
export default {
  components: {
    ContactSelectionForAppointments,
  },
  computed: {
    dialogHeader() {
      return this.$store.getters["appointments/appointmentId"]
        ? "Edit Appointment"
        : "New Appointment";
    },
    showDialog: {
      get() {
        return this.$store.getters["appointments/showDialog"];
      },
      set() {
        this.$store.commit("appointments/TOGGLE_APPOINTMENTS_DIALOG", true);
      },
    },
    loading: {
      get() {
        return this.$store.getters['appointments/appointmentLoadingForEdit']
      }
    },
    appointment: {
      get() {
        return this.$store.getters["appointments/appointment"]
      },
    },
    startDateTime() {
      return new Date(this.startDate + ' ' + this.startTime).toJSON()
    },
    endDateTime() {
      return new Date(this.endDate + ' ' + this.endTime).toJSON()
    }
  },

  data() {
    return {
      title: '',
      description: '',
      location: '',
      url: '',
      type: '',
      startDate: '',
      startTime: '12:30',
      endDate: '',
      endTime: '12:30',
      dialogDelete: false,
      startDatePicker: false,
      endDatePicker: false
    };
  },

  methods: {
    close() {
      this.$refs.appointmentForm.reset();
      this.$store.commit("appointments/CLEAR_APPOINTMENT");
      this.$store.commit("appointments/TOGGLE_APPOINTMENTS_DIALOG", false);
    },
    toggleStartDatePicker() {
      this.startDatePicker = false;
    },
    toggleEndDatePicker() {
      this.endDatePicker = false;
    },
    deleteItemConfirm() {
      this.appointments.splice(this.editedIndex, 1);
      this.closeDelete();
    },
    toggleDeleteDialog() {
      this.dialogDelete = !this.dialogDelete;
    },
    save() {
      const appointment = {
        title: this.title,
        description: this.description,
        location: this.location,
        url: this.url,
        type: this.type,
        startDate: this.startDateTime,
        endDate: this.endDateTime,
        contactId: this.$store.getters['appointments/contactId'],
        userId: this.$store.getters['auth/userId']
      }
      if (this.$store.getters['appointments/appointmentId']) {
        this.$store.dispatch("appointments/saveExistingAppointment", appointment)
      } else {
        this.$store.dispatch("appointments/saveNewAppointment", appointment);
      }
      this.close();
    },
  },
};
</script>