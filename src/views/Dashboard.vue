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
  created() {
    // we should set the loading state based on if the user is logging in or not as well
    this.$store.dispatch('auth/getUserData', this.$store.getters['auth/userId'])
  },
  computed: {
    activePageInStore() {
      return this.$store.getters['ui/currentPage']
    }
  },
  data() {
    return {
      activePage: 'Appointments'
    }
  },
  watch: {
    activePageInStore: function() {
      this.activePage = this.$store.getters['ui/currentPage']
    }
  }
};
</script>