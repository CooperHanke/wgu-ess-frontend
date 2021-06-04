<template>
  <v-sheet class="ma-6">
    <v-data-table
      :headers="headers"
      :items="testData"
      :items-per-page="10"
      class="elevation-1"
    >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>User Schedules</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
      </v-toolbar>
    </template>
    </v-data-table>
  </v-sheet>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        {
          text: "User",
          align: "start",
          sortable: true,
          value: "user",
        },
        {
          text: "Contact",
          sortable: true,
          value: "contact"
        },
        {
          text: "Start Date",
          sortable: false,
          value: "startDate",
        },
        {
          text: "Start Time",
          sortable: false,
          value: "startTime",
        },
        {
          text: "End Date",
          sortable: false,
          value: "endDate",
        },
        {
          text: "End Time",
          sortable: false,
          value: "endTime",
        }
      ],
      testData: [
        {
          user: "Test Dummy",
          contact: "New Contact",
          startDate: "Jun 3, 2021",
          startTime: "12:00 PM",
          endDate: "Jun 3, 2021",
          endTime: "02:00 PM"
        },
      ],
    };
  },
};
</script>