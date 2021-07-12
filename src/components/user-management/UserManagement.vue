<template>
  <div>
    <v-sheet class="ma-6">
      <v-data-table
        :headers="headers"
        :items="users"
        sort-by="user"
        class="elevation-1"
        :search="search"
        :loading="loading"
        loading-text="Loading... Please wait"
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

            <v-btn color="primary" class="mb-2" @click="addUser">
              Create New User
            </v-btn>

          </v-toolbar>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="editUser(item.id)">
            mdi-pencil
          </v-icon>
          <v-tooltip top v-if="item.userStatus != 'logged in user'">
            <template v-slot:activator="{ on, attrs }">
              <v-icon 
                 class="mr-2"
                :color="isLockedIcon(item)" 
                @click="disableUser(item)"
                v-bind="attrs"
                v-on="on"> 
                
                {{ isDisabledOrLocked(item) ? 'mdi-lock' : 'mdi-lock-open-outline' }} 
                
              </v-icon>
              </template>
            <span> {{ isDisabledOrLocked(item) ? 'Unlock Account' : 'Lock Account' }} </span>
          </v-tooltip>
          <v-icon small class="mr-2" v-if="item.userStatus != 'logged in user'" @click="deleteUser(item)"> mdi-delete </v-icon>
        </template>
      </v-data-table>
    </v-sheet>

    <v-dialog v-model="dialogDisable" max-width="600px" persistent>
      <v-card>
        <v-card-title>Are you sure you want to {{disableMessage[0]}} @{{ user.userName }}?</v-card-title>
        <v-card-text>You can {{disableMessage[1]}} the account again in the future</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialogDisable = !dialogDisable">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="lockUserAccount(user)">OK</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogDelete" max-width="600px" persistent>
      <v-card>
        <v-card-title>Are you sure you want to permanently delete @{{ user.userName }}?</v-card-title>
        <v-card-text>If you wish to allow this user access, please consider locking the account instead</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialogDelete = !dialogDelete">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="deleteUserAccount(user)">OK</v-btn>
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
      return this.$store.getters['users/users']
    },
    disableMessage() {
      return !this.user.isLocked ? ["disable", "enable"] : ["enable", "disable"]
    },
    loading() {
      return this.$store.getters['users/usersLoading']
    }
  },
  mounted() {
    // load the user data from the store
    this.$store.dispatch('users/loadUsers')
  },
  data: () => ({
    dialogDisable: false,
    dialogDelete: false,
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
        filterable: false,
        value: "type"
      },
      {
        text: "Status",
        align: "start",
        sortable: false,
        filterable: false,
        value: "userStatus"
      },
      {
        text: "Actions",
        value: "actions",
        filterable: false,
        sortable: false
      }
    ],
    search: '',
    user: {}
  }),
  methods: {
    editUser(userId) {
      this.$store.dispatch("users/loadUserForEdit", userId)
    },
    addUser() {
      this.$store.commit("users/TOGGLE_USER_DIALOG")
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
    disableUser(user) {
      this.user = user
      this.dialogDisable = true
    },
    deleteUser(user) {
      this.user = user
      this.dialogDelete = true
    },
    isDisabledOrLocked(user) {
      return user.userStatus === 'locked' || user.userStatus === 'disabled'
    },
    isLockedIcon(user) {
      return this.isDisabledOrLocked(user)? 'red' : 'green'
    },
    lockUserAccount(user) {
      user.isLocked = !this.isDisabledOrLocked(user)
      this.$store.dispatch("users/setLockStatus", user, { root: true })
      this.dialogDisable = false
    },
    deleteUserAccount(user) {
      this.$store.dispatch("users/deleteUser", user, { root: true })
      this.dialogDelete = false
    }
  }
}
</script>