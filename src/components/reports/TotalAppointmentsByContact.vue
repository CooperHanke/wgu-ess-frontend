<template>
  <v-sheet class="ma-6">
    <v-data-table
      :headers="headers"
      :items="testData"
      :items-per-page="5"
      class="elevation-1"
    >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Total Appointments By Contact</v-toolbar-title>
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
          text: "Contact",
          align: "start",
          sortable: true,
          value: "month",
        },
        {
          text: "Total",
          sortable: false,
          value: "total",
        },
      ],
      testData: [
        {
          month: "Test Contact",
          total: 3,
        },
      ],
    };
  },
};
</script>