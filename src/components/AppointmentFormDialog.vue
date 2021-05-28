<template>
  <div>
    <v-dialog v-model="showDialog" max-width="800px" close-delay="0">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" class="mb-2" v-bind="attrs" v-on="on">
          New Appointment
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">{{ dialogHeader }}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="appointment.name"
                  label="Customer Name"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="appointment.title"
                  label="Title"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="appointment.description"
                  label="Description"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="appointment.location"
                  label="Location"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="appointment.type"
                  label="Type"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="appointment.url"
                  label="URL"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="appointment.type"
                  label="Type"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-menu
                  v-model="startDatePicker"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="appointment.startDate"
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

              <v-col cols="12" sm="6" md="4">
                <v-menu
                  v-model="startTimePicker"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="appointment.startTime"
                      label="Start Time"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker
                    v-if="startTimePicker"
                    v-model="appointment.startTime"
                    full-width
                    @click:minute="toggleStartTimePicker"
                  ></v-time-picker>
                </v-menu>
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
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="headline"
          >Are you sure you want to delete this item?</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="deleteItemConfirm"
            >OK</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  computed: {
    dialogHeader() {
      return this.$store.state.appointment.data.id > -1
        ? "Edit Appointment"
        : "New Appointment";
    },
    showDialog: {
      get() {
        return this.$store.state.appointment.showDialog;
      },
      set() {
        this.$store.commit("toggleDialog");
      },
    },

    appointment: {
      get() {
        return this.$store.state.appointment.data;
      },
    },
  },

  data() {
    return {
      dialogDelete: false,
      startDatePicker: false,
      startTimePicker: false,
      endDatePicker: false,
      endTimePicker: false,
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
    };
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  methods: {
    close() {
      this.$store.commit("toggleDialog"); // first, close the dialog box, so user doesn't see us change the dialog type
      this.$store.commit("initializeAppointment"); // next, set the appointment to be a blank one
    },

    // editItem(item) {
    //   this.appointment = Object.assign({}, item);
    //   this.dialog = true;
    // },

    // deleteItem(item) {
    //   this.editedIndex = this.appointments.indexOf(item);
    //   this.appointment = Object.assign({}, item);
    //   this.dialogDelete = true;
    // },

    toggleStartDatePicker() {
      this.startDatePicker = false;
    },

    toggleStartTimePicker() {
      this.startTimePicker = false;
    },

    toggleEndDatePicker() {
      this.endDatePicker = false;
    },

    toggleEndTimePicker() {
      this.endTimePicker = false;
    },

    deleteItemConfirm() {
      this.appointments.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.appointment = Object.assign({}, this.defaultItem);
      });
    },

    save() {
      if (this.appointment.id > -1) {
        this.$store.commit("setAppointment", this.$store.state.appointment);
      } else {
        this.appointments.push(this.appointment);
      }
      this.close();
    },
  },
};
</script>

<style>
</style>