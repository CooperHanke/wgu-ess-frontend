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
            
            <user-form-dialog />

            <v-btn color="primary" class="mb-2" @click="addUserDialog">
              Create New User
            </v-btn>

          </v-toolbar>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="editUser(item)">
            mdi-pencil
          </v-icon>
          <v-tooltip top v-if="item.userStatus != 'logged in user'">
            <template v-slot:activator="{ on, attrs }">
              <v-icon 
                medium 
                class="mr-2" 
                @click="resetPassword(item.username)"
                v-bind="attrs"
                v-on="on"
              >
                mdi-lock-reset
              </v-icon>
            </template>
            <span>Reset Password</span>
          </v-tooltip>
          <v-tooltip top v-if="item.userStatus != 'logged in user'">
            <template v-slot:activator="{ on, attrs }">
              <v-icon 
                medium 
                :color="isLockedIcon(item)" 
                @click="disableUser(item)"
                v-bind="attrs"
                v-on="on"> 
                
                {{ isDisabledOrLocked(item) ? 'mdi-lock' : 'mdi-lock-open-outline' }} 
                
              </v-icon>
              </template>
            <span> {{ isDisabledOrLocked(item) ? 'Unlock Account' : 'Lock Account' }} </span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-sheet>
    <v-dialog v-model="dialogDisable" max-width="600px">
      <v-card>
        <v-card-title>Are you sure you want to disable this {{user.username}}?</v-card-title>
        <v-card-text>You can unlock the account again in the future</v-card-text>
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
import UserFormDialog from '@/components/user-management/UserFormDialog.vue'
export default {
  components: {
    UserFormDialog
  },
  computed: {
    users() {
      return this.$store.state.users
    },
    sameUser(user) {
      return this.$store.state.auth.userId === user.id
    }
  },
  mounted() {
    // load the user data from the store
    this.$store.dispatch('loadUsers')
  },
  data: () => ({
    dialogDisable: false,
    headers: [
      {
        text: "First Name",
        align: "start",
        sortable: true,
        value: "firstName"
      },
      {
        text: "Last Name",
        align: "start",
        sortable: true,
        value: "lastName"
      },
      {
        text: "User Name",
        align: "start",
        sortable: true,
        value: "userName"
      },
      {
        text: "User Type",
        align: "start",
        sortable: false,
        value: "type"
      },
      {
        text: "Status",
        align: "start",
        sortable: false,
        value: "userStatus"
      },
      {
        text: "Actions",
        value: "actions",
        sortable: false
      }
    ],
    search: '',
    // users: [ // mocked user data
    //   {
    //     firstName: "Standard",
    //     lastName: "User",
    //     username: "@standard.user",
    //     userType: "standard",
    //     userStatus: "enabled"
    //   },
    //   {
    //     firstName: "Standard",
    //     lastName: "Manager",
    //     username: "@local.manager",
    //     userType: "manager",
    //     userStatus: "request password reset"
    //   },
    //   {
    //     firstName: "Locked",
    //     lastName: "User",
    //     username: "@locked.user",
    //     userType: "standard",
    //     userStatus: "locked"
    //   },
    //   {
    //     firstName: "Disabled",
    //     lastName: "Standard",
    //     username: "@disabled.standard",
    //     userType: "standard",
    //     userStatus: "disabled"
    //   }
    // ],
    user: {}
  }),
  methods: {
    editUser(user) {
      this.$store.commit("SET_USER_ADD_OR_EDIT_FORM", user)
      this.$store.commit("TOGGLE_USER_DIALOG")
    },
    addUserDialog() {
      this.$store.commit("SET_USER_ADD_OR_EDIT_FORM", {})
      this.$store.commit("TOGGLE_USER_DIALOG")
    },
    getColor( userStatus ) {
      switch(userStatus) {
        case 'enabled':
          return 'green'
        case 'need password reset':
          return 'orange'
        case 'locked':
          return 'red'
        case 'logged in user':
          return 'grey'
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
      return this.isDisabledOrLocked(user)? 'red' : 'green'
    }
  }
}
</script>