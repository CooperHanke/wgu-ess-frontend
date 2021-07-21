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
            <v-form ref="appointmentForm" v-model="valid">
              <v-row>
                <v-col cols="6">
                  <v-text-field
                    v-model="title"
                    label="Title"
                    :rules="textRules"
                  ></v-text-field>
                </v-col>

                <v-col cols="6">
                  <contact-selection-for-appointments />
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="description"
                    label="Description"
                    :rules="textRules"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="location"
                    label="Location"
                    :rules="textRules"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="type"
                    label="Type"
                    :rules="textRules"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="url"
                    label="URL"
                    :rules="urlRules"
                  ></v-text-field>
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
                        :rules="startDateTimeRules"
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
                    :rules="startDateTimeRules"
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
                        :rules="filled"
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
                    :rules="endTimeRules"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="4">
                  <v-checkbox
                    v-model="enableReminder"
                    label="Enable Reminder"
                  ></v-checkbox>
                </v-col>
                <v-col v-show="this.enableReminder" cols="4">
                  <v-text-field
                    label="Reminder time on start date?"
                    v-model="reminderTime"
                    value=""
                    type="time"
                    :rules="reminderTimeRules"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
          <v-btn color="blue darken-1" text @click="save" :disabled="!valid">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import ContactSelectionForAppointments from "@/components/appointments/ContactSelectionForAppointments.vue";
import moment from "moment";

export default {
  components: {
    ContactSelectionForAppointments,
  },
  computed: {
    appointments() {
      return this.$store.getters['appointments/appointments']
    },
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
        return this.$store.getters["appointments/appointmentLoadingForEdit"];
      },
    },
    appointment: {
      get() {
        return this.$store.getters["appointments/appointment"];
      },
    },
    startDateTime() {
      return new Date(this.startDate + " " + this.startTime).toJSON();
    },
    endDateTime() {
      return new Date(this.endDate + " " + this.endTime).toJSON();
    },
    reminderDateTime() {
      return new Date(this.startDate + " " + this.reminderTime).toJSON();
    },
    hasContactId() {
      return (
        this.$store.getters["appointments/contactId"] !== null ||
        this.$store.getters["appointments/contactId"] !== ""
      );
    },
    reminderTimeRules() {
      if (this.enableReminder) {
        return [
          (v) => !!v || "Time is required for a reminder",
          () => this.checkReminderTime() || "Reminder should not be after the appointment",
        ];
      } else return []
    },
    endTimeRules() {
      if (this.startDateTime) {
        return [
          (v) => !!v || "End time is required",
          () => this.checkEndDateTime() || "Must end later than the start time and date"
        ]
      } else return []
    },
    startDateTimeRules() {
      if (this.startTime || this.startDate) {
        return [
          v => !!v || "Start date and time are required",
         () => this.isStartTimeBeforeNow() ||  "Start date and time should not be before right now",
        ]
      } else return []
    }
  },

  data() {
    return {
      title: "",
      description: "",
      location: "",
      url: "",
      type: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      dialogDelete: false,
      startDatePicker: false,
      endDatePicker: false,
      enableReminder: false,
      reminderTime: "",
      urlRules: [
        (v) => this.isValidUrl(v) || "Please enter a valid web address",
      ],
      textRules: [
        (v) => !!v || "This field is required",
        (v) =>
          /^[a-zA-Z0-9-\s]+$/g.test(v) ||
          "Uppercase charaters, spaces, dashes, and numbers only in this field",
      ],
      filled: [(v) => !!v || "This field is required"],
      valid: true,
    };
  },

  methods: {
    close() {
      this.resetForm()
      this.$store.commit("appointments/CLEAR_APPOINTMENT");
      this.$store.commit("appointments/TOGGLE_APPOINTMENTS_DIALOG", false);
    },
    resetForm() {
      this.$refs.appointmentForm.reset();
    },
    toggleStartDatePicker() {
      this.startDatePicker = false;
    },
    toggleEndDatePicker() {
      this.endDatePicker = false;
    },
    toggleDeleteDialog() {
      this.dialogDelete = !this.dialogDelete;
    },
    save() {
      // check to ensure based on current data, the appointment doesn't collide with another one
      let hasError = false
      // startTime cannot be the start of another appointment if that appointment has not ended
      this.appointments.forEach(appointment => {
        const startTime = moment(this.startDate + " " + this.startTime)
        const endTime = moment(this.endDate + " " + this.endTime)
        const appointmentStartTime = moment(appointment.startDateTime)
        const appointmentEndTime = moment(appointment.endDateTime)

        // check that appointment doesn't start before an existing appointment is over, unless it starts when the other one ends
        if (startTime.isBetween(appointmentStartTime, appointmentEndTime, null, '[]') && !startTime.isSame(appointmentEndTime)
          || endTime.isBetween(appointmentStartTime, appointmentEndTime, null, '[]') && !endTime.isSame(appointmentStartTime)
          || appointmentStartTime.isBetween(startTime, endTime, null, '[]') && !appointmentStartTime.isSame(endTime)
          || appointmentEndTime.isBetween(startTime, endTime, null, '[]') && !appointmentEndTime.isSame(startTime)
          || endTime.isSameOrBefore(startTime)
          || startTime.isSameOrAfter(endTime)) {
          hasError = true
          this.$store.dispatch('ui/showSnackbar', "Check your appontment to make sure it doesn't during another one")
        }
      });

      if (!hasError) {
        const reminderDateTime = this.enableReminder ? this.reminderDateTime : this.startDateTime
        const needReminder = this.enableReminder ? true : false // found werid issue where this value could be null
        let appointment = {
          title: this.title,
          description: this.description,
          location: this.location,
          url: this.url,
          type: this.type,
          startDate: this.startDateTime,
          endDate: this.endDateTime,
          needReminder: needReminder,
          reminderTime: reminderDateTime,
          contactId: this.$store.getters["appointments/contactId"],
          userId: this.$store.getters["auth/userId"],
        };
        if (this.$store.getters["appointments/appointmentId"]) {
          appointment.id = this.$store.getters["appointments/appointmentId"]
          this.$store.dispatch(
            "appointments/saveExistingAppointment",
            appointment
          );
        } else {
          this.$store.dispatch("appointments/saveNewAppointment", appointment);
        }
        this.close();
      }
    },
    checkEndDateTime() {
      return moment(this.endDateTime).isSameOrAfter(this.startDateTime)
    },
    checkReminderTime() {
      return moment(this.reminderDateTime).isSameOrBefore(this.startDateTime)
    },
    isStartTimeBeforeNow() {
      if (this.startDate && this.startTime) {
        return moment().isSameOrBefore(this.startDateTime)
      } else if (moment(this.startDate).day() == moment().day() && !this.startTime) {
        return true
      } else return true
    },
    isValidUrl(v) {
      const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i') // fragment locator
      return !!pattern.test(v)
    }
  },
  watch: {
    appointment: function () {
      if (this.$store.getters["appointments/appointmentId"]) {
        this.title = this.appointment.title,
        this.description = this.appointment.description,
        this.location = this.appointment.location,
        this.url = this.appointment.url,
        this.type = this.appointment.type,
        this.startDate = moment(this.appointment.startDate).format("YYYY-MM-DD"),
        this.startTime = moment(this.appointment.startTime, ["h:mm A"]).format("HH:mm"),
        this.endTime = moment(this.appointment.endTime, ["h:mm A"]).format("HH:mm"),
        this.endDate = moment(this.appointment.startDate).format("YYYY-MM-DD"),
        this.enableReminder = this.appointment.needReminder,
        this.reminderTime = moment(this.appointment.reminderTime, ["h:mm A"]).format("HH:mm")
      } else {
        this.resetForm()
      }
    },
    hasContactId: function () {
      if (this.contactId === null || this.contactId === "") {
        this.valid = false;
      }
    }
  },
};
</script>