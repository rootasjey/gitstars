<template>
  <v-container>
    <v-btn
      @click="goToStarred"
      class="gotoprevious"
      fixed
      top
      left
      fab
      >
      <v-icon>keyboard_arrow_left</v-icon>
    </v-btn>

    <div class="repo-container">
      <div class="repo-header">
        <div>
          <h1> {{preLoadedRepo.name}} </h1>
        </div>

        <div> {{preLoadedRepo.description}} </div>

        <div class="repo-header__tags">
          <v-chip label outline>
            Updated {{relativeTime(preLoadedRepo.updatedAt)}}
          </v-chip>

          <v-chip v-if="preLoadedRepo.primaryLanguage" label outline>
            {{preLoadedRepo.primaryLanguage.name}}
          </v-chip>

          <v-chip v-if="preLoadedRepo.licenseInfo" label outline>
            {{preLoadedRepo.licenseInfo.nickname}}
          </v-chip>
        </div>

        <div class="repo-stats">
          <v-tooltip bottom>
            <v-chip color="orange" text-color="white" slot="activator">
              <v-avatar class="orange darken-4">
                <v-icon>call_split</v-icon>
              </v-avatar>

              {{repository.forkCount}}
            </v-chip>

            <span>Forks</span>
          </v-tooltip>

          <v-tooltip bottom>
            <v-chip color="green" text-color="white" slot="activator">
              <v-avatar class="green darken-4">
                <v-icon>data_usage</v-icon>
              </v-avatar>

              {{formatDiskUsage(repository.diskUsage)}}
            </v-chip>

            <span>Disk usage</span>
          </v-tooltip>

          <v-tooltip v-if="repository.homepageUrl" bottom>
            <v-chip
              @click="openHomepageUrl(repository.homepageUrl)"
              class="repo-homepageUrl"
              color="grey" slot="activator" text-color="white">

              <v-avatar class="grey darken-4">
                <v-icon>explore</v-icon>
              </v-avatar>

              {{repository.homepageUrl}}
            </v-chip>

            <span>Page URL</span>
          </v-tooltip>
        </div>

        <div class="repo-actions">
          <v-btn @click="openRepoPageInNewWindow">
            Open this page in a new window
          </v-btn>
        </div>
      </div>

      <v-container class="repo-body">
        <v-card class="repo-body__card">
          <v-container>
            <div
              v-if="repository.readme"
              v-html="convertMarkdownToHtml(repository.readme.text)">
            </div>

            <div
              v-if="repository.readme2"
              v-html="convertMarkdownToHtml(repository.readme2.text)">
            </div>
          </v-container>
        </v-card>
      </v-container>
    </div>

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
  </v-container>
</template>

<script>
import gql from 'graphql-tag'
import { relativeTimeFromNow, diskUsage } from '../utils/utilities'

import showdown from 'showdown'

showdown.setFlavor('github')
const converter = new showdown.Converter()

export default {
  name: 'repository',

  data () {
    return {
      preLoadedRepo: {},
      repository: {}
    }
  },

  apollo: {
    repository: {
      query: gql`query GetRepository($name: String!, $owner: String!) {
        repository(name: $name, owner: $owner) {
          diskUsage
          forkCount
          homepageUrl
          licenseInfo {
            nickname
          }
          readme: object (expression: "master:README.md") {
            ... on Blob {
              text
            }
          }
          readme2: object (expression: "master:readme.md") {
            ... on Blob {
              text
            }
          }
        }
      }`,

      variables () {
        return {
          name: this.preLoadedRepo.name,
          owner: this.preLoadedRepo.owner.login
        }
      },

      skip () {
        return typeof this.preLoadedRepo.name === 'undefined'
      },

      result ({data}) {
        this.repository = {...data.repository}
      }
    }
  },

  mounted: function () {
    this.preLoadedRepo = {...this.$route.params}
  },

  methods: {
    convertMarkdownToHtml (markdownText) {
      return converter.makeHtml(markdownText)
    },

    formatDiskUsage (usage) {
      return diskUsage(usage)
    },

    goToStarred () {
      this.$router.push({path: '/home'})
    },

    openHomepageUrl (url) {
      const win = new this.$electron.remote.BrowserWindow({
        width: 800, height: 600, nodeIntegration: false})

      win.loadURL(url)
    },

    openRepoPageInNewWindow () {
      const win = new this.$electron.remote.BrowserWindow({
        width: 800, height: 600, nodeIntegration: false})

      win.loadURL(this.preLoadedRepo.url)
    },

    relativeTime (previous) {
      return relativeTimeFromNow(previous)
    }
  }
}
</script>

<style scoped>

  .gotoprevious .material-icons {
    font-size: 42px;
  }

  .repo-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .repo-header {
    align-items: center;
    display: flex;
    flex-direction: column;

    padding: 40px 20px;
    width: 100%;
  }

  .repo-header h1 {
    font-size: 4em;
  }

  .repo-header__tags {
    display: flex;
  }

  .repo-stats {
    margin: 20px 0;
  }

  .repo-actions {
    margin: 20px 0;
  }

  .repo-body__card {
    margin: 20px;
    padding: 40px;
  }

</style>

<style>
  .repo-homepageUrl .chip__content {
    cursor: pointer;
  }
</style>

