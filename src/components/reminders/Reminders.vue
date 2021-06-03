<template>
  <v-menu
    offset-y
    v-model="remindersDialogOpen"
    :open-on-hover="!hasReminders"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-badge
        :value="quantity"
        :content="quantity"
        overlap
        bottom
        color="red"
      >
        <v-btn icon class="white--text" v-bind="attrs" v-on="on">
          <v-icon large>{{ hasReminders ? 'mdi-bell' : 'mdi-bell-outline' }}</v-icon>
        </v-btn>
      </v-badge>
    </template>
    
    <v-card v-if="!hasReminders">
      <v-card-text>No appointments to show</v-card-text>
    </v-card>

    <v-card v-else>
      <v-list>
        <v-list-item v-for="reminder in reminders" :key="reminder.text">
          <v-list-item-title>{{ reminder.text }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  created() {
    // for testing; will allow the store to constantly check in data for reminders to
    this.reminders = [{
      text: "Simple reminder for appointment at 10 PM"
    }]
  },
  computed: {
    hasReminders() {
      return this.reminders.length > 0
    },
    quantity() {
      return this.reminders.length
    }
  },
  data() {
    return {
      remindersDialogOpen: false,
      reminders: [],
    }
  }
}
</script>