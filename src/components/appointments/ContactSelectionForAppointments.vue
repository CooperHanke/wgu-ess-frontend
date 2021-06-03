<template>
  <v-select 
    v-model="select"
    label="Contact Name"
    :items="contacts"
    item-text="name"
    item-value="name"
  ></v-select>
</template>

<script>
export default {
  created() {
    this.contacts = this.$store.state.contacts
  },
  data() {
    return {
      contacts: [],
    }
  },
  computed: {
    select: {
      get() {
        return this.$store.state.appointment.data.name
      },
      set(name) {
        console.log("set name to " + name)
        this.$store.commit('setAppointmentContact', name)
      }
    }
  },
};
</script>