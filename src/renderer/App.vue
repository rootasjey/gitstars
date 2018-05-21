<template>
  <div id="app">
    <v-app :dark="theme">
      <v-content>
        <v-container fluid fill-height>
          <v-layout justify-center>
            <router-view v-on:theme-changed="updateTheme">
            </router-view>
          </v-layout>
        </v-container>
      </v-content>
    </v-app>
  </div>
</template>

<script>
  export default {
    name: 'gitstars',

    data () {
      return {
        theme: localStorage.getItem('darkTheme') === 'true'
      }
    },

    methods: {
      updateTheme () {
        this.theme = localStorage.getItem('darkTheme') === 'true'
      }
    }
  }
</script>

<style>

  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  .container {
    margin: 0;
    padding: 0;
  }

  .btn__content .material-icons {
    display: inline-flex; /*shouldn't be necessary*/
  }

  .gototop .material-icons {
    font-size: 42px;
  }

  pre code {
    padding: 20px;
  }

</style>
