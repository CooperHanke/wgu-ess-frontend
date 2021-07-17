<template>
  <v-sheet class="ma-6">
    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">
              Month
            </th>
            <th class="text-left">
              Type
            </th>
            <th class="text-left">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in reportItems"
            :key="index"
          >
            <td>{{ item.month }}</td>
            <td>{{ item.type }}</td>
            <td>{{ item.total }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </v-sheet>
</template>

<script>
import moment from 'moment'
export default {
  mounted() {
    this.appointmentsByMonth()
  },
  computed: {
    appointments() {
      return this.$store.getters["appointments/appointments"];
    },
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
          align: "right",
        },
        {
          text: "Total",
          sortable: false,
          value: "total",
          align: "right",
        },
      ],
      reportItems: [],
    };
  },
  methods: {
    appointmentsByMonth() {
      let appointments = this.appointments;
      let result = []
      // for each appointment, get only the starting date and the type
      appointments.forEach(appointment => {
        // format the date to only be the month and year
        const startDate = moment(appointment.startDate, "MMM YYYY")
        const type = appointment.type
        result.push({ startDate, type })
      })
      result = result.sort((a, b) => {
        return moment(a.startDate, b.startDate)
      })
      // { month: 'month', type: 'type', total: 0 }
      console.log(result)
      this.reportItems = appointments
    },
  },
};
</script>