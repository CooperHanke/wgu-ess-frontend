<template>
  <v-main>
    <navbar />
    <component v-bind:is="this.activePage" />
  </v-main>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import Appointments from '@/components/Appointments.vue'
import Contacts from '@/components/Contacts.vue'
import Reports from '@/components/Reports.vue'
export default {
  components: {
    Appointments,
    Contacts,
    Navbar,
    Reports
  },
  data() {
    return {
      activePage: 'Appointments'
    }
  },
  watch: {
    '$store.state.activeDashboardPage': function() {
      this.activePage = this.$store.state.activeDashboardPage
    }
  }
};
</script>

<style>
</style>