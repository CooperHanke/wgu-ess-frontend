<template>
  <v-select
    v-model="select"
    label="Contact Name"
    :items="contacts"
    item-text="name"
    item-value="id"
    no-data-text="No contacts available. Please add one to create an appointment."
    required
    :rules="filled"
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
        return this.contacts.find(contact => contact.id === this.$store.getters['appointments/contactId'])
      },
      set(id) {
        this.$store.commit("appointments/SET_CONTACT_FOR_APPOINTMENT", id);
      },
    },
  },
  data() {
    return {
      filled: [(v) => !!v || "This field is required"]
    }
  }
};
</script>