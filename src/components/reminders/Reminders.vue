<template>
  <v-menu offset-y v-model="remindersDialogOpen" :open-on-hover="!hasReminders">
    <template v-slot:activator="{ on, attrs }">
      <v-badge :value="quantity" :content="quantity" overlap bottom color="red">
        <v-btn icon class="white--text" v-bind="attrs" v-on="on">
          <v-icon large>{{
            hasReminders ? "mdi-bell" : "mdi-bell-outline"
          }}</v-icon>
        </v-btn>
      </v-badge>
    </template>

    <v-card v-if="!hasReminders">
      <v-card-text>No appointments to show</v-card-text>
    </v-card>

    <v-card v-else width="450" class="mx-auto">
      <v-list two-line>
        <template v-for="(item, index) in reminders">
          <v-subheader
            v-if="item.header"
            :key="item.header"
            v-text="item.header"
          ></v-subheader>

          <v-divider
            v-else-if="item.divider"
            :key="index"
            :inset="item.inset"
          ></v-divider>

          <v-list-item v-else :key="index">
            
            <v-list-item-icon>
              <v-icon> mdi-information </v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title v-html="item.title"></v-list-item-title>
              <v-list-item-subtitle
                v-html="item.subtitle"
              ></v-list-item-subtitle>
            </v-list-item-content>

            <v-btn icon>
              <v-icon @click="dismissReminder(item.reminder)"> mdi-bell-off </v-icon>
            </v-btn>

          </v-list-item>
        </template>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
import notification from '@/assets/notification.wav'
export default {
  computed: {
    reminders() {
      let reminders = this.$store.getters['appointments/reminders']
      let dataToShow = [{ header: "Reminders" }]
      reminders.forEach(reminder => {
        dataToShow.push({
          reminder: reminder,
          title: `You have an appointment at ${reminder.startTime}`,
          subtitle: `<span class="text--primary">With ${reminder.name}</span>`
        })
        dataToShow.push({ divider: true, inset: true })
      })
      return dataToShow
    },
    hasReminders() {
      return this.$store.getters['appointments/reminders'].length > 0;
    },
    quantity() {
      return this.$store.getters['appointments/reminders'].length
    }
  },
  data() {
    return {
      remindersDialogOpen: false,
    };
  },
  methods: {
    dismissReminder(reminder) {
      this.$store.dispatch('appointments/dismissReminder', reminder)
    },
    playSound () {
      var audio = new Audio(notification);
      audio.play();
    }
  },
  watch: {
    quantity: function(oldVal, newVal) {
      if (this.hasReminders && (newVal < oldVal)) {
        this.playSound()
      }
    }
  }
};
</script>