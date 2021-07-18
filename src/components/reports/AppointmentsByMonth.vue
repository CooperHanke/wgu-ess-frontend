<template>
  <v-sheet class="ma-6">
    <v-data-table
      :headers="headers"
      :items="reportItems"
      item-key="id"
      :items-per-page="-1"
      class="elevation-1"
      group-by="month"
      :loading="loading"
      :custom-sort="customSort"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Total Appointments By Month</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-toolbar-title>Total Appointments: {{total}}</v-toolbar-title>
        </v-toolbar>
      </template>
      <template v-slot:no-data>
        No appointments are registered
    </template>
    </v-data-table>
  </v-sheet>
</template>

<script>
import moment from "moment";
export default {
  mounted() {
    this.appointmentsByMonth();
  },
  computed: {
    appointments() {
      return this.$store.getters["appointments/appointments"];
    },
    total() {
      return this.appointments.length
    }
  },
  data() {
    return {
      headers: [
        {
          text: "Month",
          align: "start",
          sortable: true,
          value: "month",
        },
        {
          text: "Type",
          value: "type",
          align: "left",
        },
        {
          text: "Count",
          sortable: true,
          value: "count",
          align: "center",
        },
        {
          text: "Total for Month",
          sortable: true,
          value: "total",
          align: "right",
        },
      ],
      loading: false,
      reportItems: [],
    };
  },
  methods: {
    appointmentsByMonth() {
      this.loading = true

      let appointments = this.appointments;
      let results = [];

      // for each appointment, get only the starting date and the type
      appointments.forEach((appointment) => {
        // using the helper property of the appointment to assist sorting
        const startDate = moment(appointment.startDateTime);
        const type = appointment.type;
        results.push({ startDate, type });
      });

      // now that the list is only the essential data, it's time to sort
      results.sort((a, b) => a.startDate - b.startDate);

      let months = []; // a store for our months
      let total = 0;

      // divide into months and appointment types
      for (let i = 0; i < results.length; i++) {
        const appointmentMonth = moment(results[i].startDate).month();
        const appointmentYear = moment(results[i].startDate).year();
        const formattedMonth = moment(
          `${appointmentMonth + 1}/1/${appointmentYear}`
        ).format("MMMM YYYY");

        let monthIndex = months.findIndex(
          (obj) => obj.month === formattedMonth && obj.type === results[i].type
        );
        if (monthIndex < 0) {
          months.push({
            month: formattedMonth,
            type: results[i].type,
            count: 1,
          });
        } else {
          months[monthIndex].count++;
        }

        if (results[i + 1] !== undefined) {
          const monthOfNextAppointment = moment(
            results[i + 1].startDate
          ).month();
          // if this month isn't the same as last month, then we have the final count for the whole month
          if (appointmentMonth !== monthOfNextAppointment) {
            total++;
            months.push({ month: formattedMonth, total: total });
            total = 0;
          } else {
            total++;
          }
        } else {
          // we have our last total, time to add it and get out of this expensive for loop
          total++
          months.push({ month: formattedMonth, total: total });
        }
      }

      this.loading = false;
      this.reportItems = months;
    },

    customSort(items, index, isDesc) {
      items.sort((a, b) => {
        if (index[0] === 'month') {
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
};
</script>