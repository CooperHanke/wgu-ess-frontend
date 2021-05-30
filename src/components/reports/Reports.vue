<template>
  <component v-bind:is="reportPage" />
</template>

<script>
import AppointmentsByMonth from '@/components/reports/AppointmentsByMonth.vue'
export default {
  components: {
    AppointmentsByMonth
  },
  computed: {
    reportPage: {
      get() {
        return this.$store.state.activeReportPage
      }
    }
  }
}
</script>

<style>

</style>