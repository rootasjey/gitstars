<template>
  <v-container ma-3>
    <v-flex> <!-- header -->
      <v-chip>
        <v-avatar> <img :src="viewer.avatarUrl" alt="viewer avatar"> </v-avatar>

        {{ viewer.login }}
      </v-chip>

      <v-tooltip bottom>
        <v-btn flat icon color="pink" slot="activator" @click="logout">
          <v-icon>lock_open</v-icon>
        </v-btn>

        <span>logout</span>
      </v-tooltip>

      <v-tooltip bottom>
        <v-btn flat icon color="pink" slot="activator" @click="dialogSettings = true">
          <v-icon>settings</v-icon>
        </v-btn>

        <span>settings</span>
      </v-tooltip>

      <v-tooltip bottom>
        <v-chip slot="activator">
          <v-avatar>
            <v-icon>stars</v-icon>
          </v-avatar>

          <span v-if="viewer.starredRepositories">
              {{viewer.starredRepositories.totalCount}}
              </span>
        </v-chip>

        <span>total starred repositories</span>
      </v-tooltip>
    </v-flex>

    <!-- body -->
    <div class="starred-repos">
      <div class="starred-repos__no-result"
        v-if="noResult">

        <v-icon class="starred-repos__no-result__icon">mood_bad</v-icon>

        <span class="starred-repos__no-result__title">
          Sorry, no repository matches your request.
        </span>
      </div>

      <v-layout v-if="filteredRepositories">
        <v-container grid-list-md fluid wrap>
          <v-layout row wrap>
            <v-flex
              v-for="item in filteredRepositories.edges"
              :key="item.node.id">

              <v-card height="200" width="250" hover
                :style="{ backgroundColor: getBackgroundColor(item.node.primaryLanguage),
                          color: getTextColor(item.node.primaryLanguage)
                        }">
                <v-container @click="goToRepo(item.node)" fill-height style="align-items: flex-start;">


                <v-card-title primary-title class="starred-repo__title">

                  <div class="headline"> {{item.node.name}} </div>
                  <div class="starred-repo__description"> {{item.node.description}} </div>

                </v-card-title>

                <v-footer class="starred-repo__footer">
                  <span>Updated {{relativeTime(item.node.updatedAt)}} </span>
                </v-footer>

                </v-container>
              </v-card>

            </v-flex>
          </v-layout>
        </v-container>
      </v-layout>
    </div>

    <!-- full screen dialog -->
    <v-dialog
      v-model="dialogSettings"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      scrollable
      >
      <v-card tile>
        <v-toolbar>
          <v-btn icon @click.native="dialogSettings = false">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>Settings</v-toolbar-title>
        </v-toolbar>

        <v-card-text>
          <v-switch
            class="switch-darktheme"
            hide-details
            :label="`dark theme: ${darkThemeLabel}`"
            slot="activator"
            row
            v-model="darkTheme">
          </v-switch>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- footer -->
    <v-btn
      @click="$vuetify.goTo(0)"
      class="gototop"
      color="pink"
      dark
      fixed
      bottom
      right
      fab
      >
        <v-icon>keyboard_arrow_up</v-icon>
    </v-btn>

    <v-text-field
      box
      class="search-bar__text-field"
      clearable
      placeholder="search repositories"
      solo
      v-model="searchInput">
    </v-text-field>
  </v-container>
</template>

<script>
import gql from 'graphql-tag'
import tinycolor from 'tinycolor2'
import { relativeTimeFromNow } from '../utils/utilities'

export default {
  name: 'home',

  data () {
    return {
      dialogSettings: false,
      filteredRepositories: {}, // useful for search
      noResult: false,
      searchInput: '',
      darkTheme: localStorage.getItem('darkTheme') === 'true',
      timer: null,
      viewer: {login: 'anonymous'}
    }
  },

  computed: {
    darkThemeLabel: function () {
      return this.darkTheme ? 'on' : 'off'
    }
  },

  watch: {
    searchInput: function (text) {
      clearTimeout(this.timer)

      if (!text) {
        this.resetAllInitialRepositories()
        return
      }

      this.timer = window.setTimeout(() => {
        this.searchRepositories(text)
      }, 500)
    },

    darkTheme: function (value) {
      localStorage.setItem('darkTheme', `${value}`)
      this.$emit('theme-changed')
    }
  },

  mounted () {
    if (!localStorage.getItem('token')) {
      this.$router.push({name: 'connection'})
    }
  },

  apollo: {
    viewer: {
      query: gql`{
        viewer {
          avatarUrl
          login
          starredRepositories(last: 100) {
            edges {
              node {
                id
                name
                description
                owner {
                  login
                }
                primaryLanguage {
                  color
                  id
                  name
                }
                updatedAt
                url
              }
            }
            totalCount
          }
        }
      }`,
      result ({data}) {
        this.viewer = {...data.viewer}
        this.filteredRepositories = {...this.viewer.starredRepositories}
      }
    }
  },

  methods: {
    getBackgroundColor (primaryLanguage) {
      return primaryLanguage ? primaryLanguage.color : ''
    },

    getTextColor (primaryLanguage) {
      if (!primaryLanguage) return 'inherit'

      const color = tinycolor(primaryLanguage.color)
      const isLight = color.isLight()

      return isLight ? 'black' : 'white'
    },

    goToConnect () {
      this.$router.push({name: 'connection'})
    },

    goToRepo (repo) {
      this.$router.push({name: 'repository', params: repo})
    },

    logout () {
      this.$electron.ipcRenderer.send('clear-cookies')
      localStorage.removeItem('token')
      this.$router.push({name: 'connection'})
    },

    relativeTime (previous) {
      return relativeTimeFromNow(previous)
    },

    resetAllInitialRepositories () {
      this.noResult = false
      this.filteredRepositories.edges = {...this.viewer.starredRepositories.edges}
    },

    searchRepositories (text) {
      this.filteredRepositories.edges = this.viewer.starredRepositories.edges
        .filter((edge) => {
          const foundInTitle = edge.node.name
            ? edge.node.name.indexOf(text) > -1 : false

          const foundInDesc = edge.node.description
            ? edge.node.description.toLocaleLowerCase().indexOf(text) > -1 : false

          return foundInTitle || foundInDesc
          // return edge.node.name.indexOf(text) > -1 ||
          //   edge.node.description
          //   ? edge.node.description.toLocaleLowerCase().indexOf(text) > -1 : false
        })

      this.noResult = this.filteredRepositories.edges.length === 0
    }
  }
}
</script>

<style scoped>
  .user-login {
    margin: auto;
    padding: 10px;
    position: relative;
  }

  .starred-repos {
    padding-bottom: 40px;
  }

  .starred-repos h1 {
    margin-left: 5px;
  }

  .starred-repo__title {
    align-items: flex-start;
    flex-direction: column;
  }

  .starred-repo__title .headline {
    max-height: 30px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .starred-repo__description {
    max-height: 80px;
    overflow: hidden;
  }

  .starred-repo__footer {
    bottom: 0;
    padding-left: 15px;
    position: absolute;

    width: 100%;
  }

  .search-bar__text-field {
    bottom: 0;
    left: 0;
    position: fixed;
  }

  .starred-repos__no-result {
    display: flex;
    flex-direction: column;
    align-items: center;

    margin-top: 100px;
  }

  .starred-repos__no-result__title {
    font-size: 2em;
  }

  .starred-repos__no-result__icon {
    font-size: 5em;
    cursor: pointer;
  }

  .starred-repos__no-result__icon:hover {
    transform: rotate(180deg);
  }

  .gototop {
    bottom: 62px;
  }

</style>
