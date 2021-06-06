<template>
  <div>
    <v-sheet class="ma-6">
      <v-data-table
        :headers="headers"
        :items="users"
        sort-by="user"
        class="elevation-1"
      >
        <template v-slot:item.userStatus="{ item }">
          <v-chip
            :color="getColor(item.userStatus)"
            dark
        >
          {{ item.userStatus }}
          </v-chip>
        </template>
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Users Enrolled In System</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>

          <v-text-field
            v-model="search"
            clearable
            single-line
            hide-details
            prepend-inner-icon="mdi-magnify"
            label="Search by name or user name..."
          ></v-text-field>

            <v-spacer></v-spacer>
            
            <!-- <contact-form-dialog /> -->

          </v-toolbar>
        </template>
        <!-- <template v-slot:[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="editContact(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="deleteContact(item)"> mdi-delete </v-icon>
        </template> -->
      </v-data-table>
    </v-sheet>
    <!-- <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="headline"
          >Are you sure you want to delete this item?</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="deleteContactConfirm"
            >OK</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog> -->
  </div>
</template>

<script>
export default {
  data: () => ({
    headers: [
      {
        text: "User's Full Name",
        align: "start",
        sortable: true,
        value: "fullName"
      },
      {
        text: "User Name",
        align: "start",
        sortable: true,
        value: "username"
      },
      {
        text: "User Type",
        align: "start",
        sortable: true,
        value: "userType"
      },
      {
        text: "User's Status",
        align: "start",
        sortable: true,
        value: "userStatus"
      }
    ],
    search: '',
    users: [
      {
        fullName: "Standard User",
        username: "@standard.user",
        userType: "standard",
        userStatus: "online"
      },
      {
        fullName: "Standard Manager",
        username: "@local.manager",
        userType: "manager",
        userStatus: "password needs reset"
      },
      {
        fullName: "Locked User",
        username: "@locked.user",
        userType: "standard",
        userStatus: "locked"
      },
      {
        fullName: "Disabled Standard",
        username: "@disabled.standard",
        userType: "standard",
        userStatus: "disabled"
      }
    ]
  }),
  methods: {
    getColor( userStatus ) {
      switch(userStatus) {
        case 'online':
          return 'green'
        case 'password needs reset':
          return 'cyan'
        case 'locked':
          return 'orange'
        case 'disabled':
          return 'red'
        default:
          return 'grey'
      }
    }
  }
}
</script>