<template>
  <v-main>
    <navbar />
    <component v-bind:is="this.activePage" />
  </v-main>
</template>

<script>
import Navbar from '@/components/navbar/Navbar.vue'
import Appointments from '@/components/appointments/Appointments.vue'
import Contacts from '@/components/contacts/Contacts.vue'
import Reports from '@/components/reports/Reports.vue'
import UserManagement from '@/components/user-management/UserManagement.vue'
export default {
  components: {
    Appointments,
    Contacts,
    Navbar,
    Reports,
    UserManagement
  },
  // since we are loading data, let's get the appointments and contacts sorted at this higher level
  created() {
    this.$store.commit('initializeAppointments')
    this.$store.commit('initializeContacts')
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