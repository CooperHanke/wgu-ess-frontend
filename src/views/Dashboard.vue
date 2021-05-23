<template>
  <v-main>
    <navbar />
    <appointments />
  </v-main>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import Appointments from '@/components/Appointments.vue'
export default {
  components: {
    Appointments,
    Navbar
  },
};
</script>

<style>
</style>