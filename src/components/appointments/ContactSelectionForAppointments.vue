<template>
  <v-select
    v-model="select"
    label="Contact Name"
    :items="contacts"
    item-text="name"
    item-value="id"
    no-data-text="No contacts available. Please add one to create an appointment."
    required
  ></v-select>
</template>

<script>
export default {
  created() {
    this.$store.dispatch("contacts/loadContactsByLoggedInUser");
  },
  computed: {
    contacts: {
      get() {
        return this.$store.getters["contacts/contacts"];
      },
    },
    select: {
      get() {
        return this.$store.getters["appointments/appointmentContact"];
      },
      set(id) {
        this.$store.commit("appointments/SET_CONTACT_FOR_APPOINTMENT", id);
      },
    },
  },
};
</script>