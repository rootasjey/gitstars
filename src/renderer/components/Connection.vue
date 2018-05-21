<template>
  <v-container ma-5>
    <v-btn
      @click="goToHome"
      class="gotohome"
      fixed
      top
      left
      fab
      >
      <v-icon>keyboard_arrow_left</v-icon>
    </v-btn>

    <v-layout class="connection-container" ma-3 column align-center>
      <h1>Connection</h1>
      <h3>Connect to your GitHub account or enter an user login</h3>

      <v-btn color="pink" @click="connectOauth">
        Connect
      </v-btn>
    </v-layout>

    <v-snackbar
      bottom
      color="pink"
      :timeout="timeout"
      v-model="snackbar"
    >
      You must connect to your GitHub account to view your starred repositories.
    </v-snackbar>

  </v-container>
</template>

<script>

export default {
  name: 'connection',

  data () {
    return {
      snackbar: false,
      timeout: 3000,
      warningMessage: false
    }
  },

  mounted () {
    this.$electron.ipcRenderer.on('github-oauth-reply', (event, response) => {
      localStorage.setItem('token', response.access_token)

      this.$router.push({name: 'home'})
    })
  },

  methods: {
    goToHome () {
      if (!localStorage.getItem('token')) {
        this.warningMessage = true
        this.snackbar = true
        return
      }

      this.$router.push({path: '/home'})
    },

    connectOauth () {
      this.$electron.ipcRenderer.send('github-oauth', 'getToken')
    }
  }
}
</script>

<style scoped>

  .gotohome .material-icons {
    font-size: 42px;
  }

</style>
