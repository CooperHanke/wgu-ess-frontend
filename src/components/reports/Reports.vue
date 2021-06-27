<template>
  <component v-bind:is="reportPage" />
</template>

<script>
import AppointmentsByMonth from '@/components/reports/AppointmentsByMonth.vue'
import UserSchedules from '@/components/reports/UserSchedules.vue'
import TotalAppointmentsByContact from '@/components/reports/TotalAppointmentsByContact.vue'
export default {
  components: {
    AppointmentsByMonth,
    TotalAppointmentsByContact,
    UserSchedules
  },
  computed: {
    reportPage: {
      get() {
        return this.$store.state.ui.activeReportPage
      }
    }
  }
}
</script>