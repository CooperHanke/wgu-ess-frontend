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
import Welcome from '@/components/ui/Welcome.vue'
export default {
  components: {
    Appointments,
    Contacts,
    Navbar,
    Reports,
    UserManagement,
    Welcome
  },
  mounted: function () {
    window.setInterval(() => {
      if (this.$store.getters['auth/userId']) {
        this.$store.dispatch('appointments/loadAppointmentsByLoggedInUser')
      }
    }, 15000)
  },
  created() {
    this.$store.dispatch('auth/getUserData', this.$store.getters['auth/userId'])
    this.$store.dispatch('contacts/loadContactsByLoggedInUser')
    this.$store.dispatch('appointments/loadAppointmentsByLoggedInUser')
  },
  computed: {
    activePageInStore() {
      return this.$store.getters['ui/currentPage']
    },
    isManager() {
      return this.$store.getters['auth/userType'] === 'Manager'
    }
  },
  data() {
    return {
      activePage: 'Welcome'
    }
  },
  watch: {
    activePageInStore: function() {
      this.activePage = this.$store.getters['ui/currentPage']
    },
    isManager: function() {
      this.$store.dispatch('users/loadUsers')
      this.$store.dispatch('contacts/loadAllContacts')
      this.$store.dispatch('appointments/loadAllAppointments')
    }
  }
};
</script>