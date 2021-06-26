<template>
  <div>
    <v-sheet class="ma-6">
      <v-data-table
        :headers="headers"
        :items="users"
        sort-by="user"
        class="elevation-1"
      >
        <template v-slot:[`item.userStatus`]="{ item }">
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
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon medium class="mr-2" @click="resetPassword(item.username)">
            mdi-lock-reset
          </v-icon>
          <v-icon medium :color="isLockedIcon(item)" @click="disableUser(item)"> {{ isDisabledOrLocked(item) ? 'mdi-lock' : 'mdi-lock-open-outline' }} </v-icon>
        </template>
      </v-data-table>
    </v-sheet>
    <v-dialog v-model="dialogDisable" max-width="600px">
      <v-card>
        <v-card-title>Are you sure you want to disable this {{user.username}}?</v-card-title>
        <v-card-text>You can unlock again in the future</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text >Cancel</v-btn>
          <v-btn color="blue darken-1" text
            >OK</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data: () => ({
    dialogDisable: false,
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
      },
      {
        text: "Actions",
        value: "actions",
        sortable: false
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
        userStatus: "request password reset"
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
    ],
    user: {}
  }),
  methods: {
    getColor( userStatus ) {
      switch(userStatus) {
        case 'online':
          return 'green'
        case 'request password reset':
          return 'cyan'
        case 'locked':
          return 'orange'
        case 'disabled':
          return 'red'
        default:
          return 'grey'
      }
    },
    resetPassword(username) {
      console.log(`would have reset password for ${username}`)
    },
    disableUser(user) {
      console.log(`would have disabled account for ${user.username}`)
      this.user = user
      this.dialogDisable = true
    },
    isDisabledOrLocked(user) {
      return user.userStatus === 'locked' || user.userStatus === 'disabled'
    },
    isLockedIcon(user) {
      if (this.isDisabledOrLocked(user)) {
        return 'red'
      } else {
        return 'green'
      }
    }
  }
}
</script>