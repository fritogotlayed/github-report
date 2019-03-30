<i18n>
{
  "en": {
    "addRepositoryMessage": "Why not add some now!",
    "noRepositoriesMessage": "It appears you do not have any repositories.",
    "repoGridHeader": "Repository",
    "enableGridHeader": "Enable",
    "untilRefreshLabel": "Refresh in:",
    "refreshButton": "Refresh"
  }
}
</i18n>

<template>
  <section class="section">

    <div class="columns">
      <div class="column is-3">
        <table class="table is-striped is-narrow is-fullwidth is-hoverable" v-show="repositories.length > 0">
          <thead>
            <td>{{$t('repoGridHeader')}}</td>
            <td>{{$t('enableGridHeader')}}</td>
          </thead>
          <tfoot>
            <td></td>
            <td>
              <label class="checkbox">
                <input type="checkbox" @change="allRepoToggled()" v-model="allReposEnabled">
              </label>
            </td>
          </tfoot>
          <tbody>
            <tr v-for="repo in repositories" :key="repo.key">
              <td>{{repo.key}}</td>
              <td>
                <label class="checkbox">
                  <input type="checkbox" @change="repoToggled()" v-model="repo.enabled">
                </label>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-show="repositories.length == 0">
          {{$t("noRepositoriesMessage")}}
          <a v-on:click="$router.push({name: 'Repositories'})">{{$t("addRepositoryMessage")}}</a>
        </div>
        <div class="field is-pulled-left">
          <div>
            <strong>Interval:</strong>
            {{convertToHumanReadable(this.refreshIncrement)}}
          </div>
          <div>
            <strong>{{$t('untilRefreshLabel')}}</strong>
            <span v-show="nextRefresh == null && timeUntilNextRefreshDisplay != 'disabled'">
              <i class="fa fa-spinner fa-spin" ></i>
            </span>
            {{this.timeUntilNextRefreshDisplay}}
          </div>
        </div>
        <div class="field is-pulled-right">
          <div class="control">
            <button class="button is-primary" @click="forceRefresh(true)" :disabled="nextRefresh == null && timeUntilNextRefreshDisplay != 'disabled'">{{$t("refreshButton")}}</button>
          </div>
        </div>
      </div>

      <div class="column is-9">
        <div class="columns" v-show="reportData.total != 0">
          <div class="column">
            <PrWatchGroup v-show="reportData.doNotMerge.length > 0" title="Do Not Merge" :pullRequests="reportData.doNotMerge"></PrWatchGroup>
            <PrWatchGroup v-show="reportData.requestsFeedback.length > 0" title="Requests Feedback" :pullRequests="reportData.requestsFeedback"></PrWatchGroup>
            <PrWatchGroup v-show="reportData.noReviews.length > 0" title="Needs Review" :pullRequests="reportData.noReviews"></PrWatchGroup>
            <PrWatchGroup v-show="reportData.oneReview.length > 0" title="Needs Second Review" :pullRequests="reportData.oneReview"></PrWatchGroup>
            <PrWatchGroup v-show="reportData.twoOrMoreReviews.length > 0" title="Ready To Merge" :pullRequests="reportData.twoOrMoreReviews"></PrWatchGroup>
          </div>
        </div>
        <div class="tile is-ancestor" v-show="reportData.total == 0">
          No data available.
        </div>
      </div>
    </div>

  </section>
</template>

<script>
import GithubApi from '@/classes/githubApi.js'
import PrReportBuilder from '@/classes/prReportBuilder.js'
import PrWatchGroup from '@/components/prWatchGroup'
import { convertMsToHumanReadable, COMMON_TIMES } from '@/classes/utils.js'
const CLOCK_INTERVAL = COMMON_TIMES.second
const REFRESH_INCREMENT = 5 * COMMON_TIMES.minute
const REFRESH_TOTAL_TIME = 10 * COMMON_TIMES.hour

export default {
  name: 'PrWatcher',
  data () {
    return {
      repositories: [],
      reportData: {
        total: 0,
        doNotMerge: [],
        requestsFeedback: [],
        noReviews: [],
        oneReview: [],
        twoOrMoreReviews: []
      },
      refreshIncrement: REFRESH_INCREMENT,
      refreshUntil: null,
      nextRefresh: null,
      timeUntilNextRefreshDisplay: null,
      clockIntervalIds: [],
      allReposEnabled: false
    }
  },
  methods: {
    allRepoToggled: function () {
      // NOTE: This gets fired before vue has a chance to update the backing data.
      if (!this.allReposEnabled) {
        this.repositories.forEach(r => {
          r.enabled = false
        })
      } else {
        this.repositories.forEach(r => {
          r.enabled = true
        })
      }
    },

    repoToggled: function () {
      let allTrue = true
      this.repositories.forEach(r => {
        if (!r.enabled) {
          allTrue = false
        }
      });

      this.allReposEnabled = allTrue
    },

    forceRefresh: function (updateRefreshUtil) {
      if (updateRefreshUtil) {
        this.refreshUntil = new Date(new Date().getTime() + REFRESH_TOTAL_TIME)
      }

      this.cleanupIntervalIds()

      this.nextRefresh = null
      this.timeUntilNextRefreshDisplay = ''
      if (this.refreshUntil > new Date()) {
        this.buildReport(() => {
          this.clockIntervalIds.push(setInterval(this.updateClock, CLOCK_INTERVAL))
        })
      } else {
        this.timeUntilNextRefreshDisplay = 'disabled'
      }
    },

    convertToHumanReadable: function (value) {
      return convertMsToHumanReadable(value)
    },

    updateClock: function () {
      if (this.nextRefresh == null) {
        this.buildReport(() => {
          this.nextRefresh = new Date(new Date().getTime() + this.refreshIncrement)
        })
      } else {
        let interval = this.nextRefresh - new Date()
        if (interval > 0) {
          this.timeUntilNextRefreshDisplay = this.convertToHumanReadable(interval)
        } else {
          this.forceRefresh()
        }
      }
    },

    buildReport: function (callback) {
      let builder = new PrReportBuilder()
      let targets = []
      this.repositories.map((r) => {
        if (r.enabled) {
          targets.push({
            githubPass: r.token,
            githubRepo: r.key,
            enterpriseUrl: r.enterpriseUrl
          })
        }
      })

      builder.buildReports(targets).then(d => {
        this.reportData = this.flattenPrReport(d)
        if (callback) {
          callback()
        }
      })
    },

    cleanupIntervalIds: function () {
      let id = null
      if (this.clockIntervalIds.length > 0) {
        do {
          id = this.clockIntervalIds.pop()
          if (id) {
            clearInterval(id)
          }
        } while (id)
      }
    },

    preprocessRepoForDisplay: function (repo) {
      let count = repo.doNotMerge.length + repo.other.length
      let requestsFeedback = []
      let noReviews = []
      let oneReview = []
      let twoOrMoreReviews = []

      repo.other.forEach(pr => {
        pr.pullUrl = 'https://github.com/' + repo.repo + '/pull/' + pr.number
        if (pr.hasFailedReview()) {
            requestsFeedback.push(pr)
        } else {
            let cnt = Object.keys(pr.reviews).length
            if (cnt === 0){
                noReviews.push(pr)
            } else if (cnt === 1) {
                oneReview.push(pr)
            } else {
                twoOrMoreReviews.push(pr)
            }
        }
      })

      repo.doNotMerge.forEach(pr => {
        pr.pullUrl = 'https://github.com/' + repo.repo + '/pull/' + pr.number
      })

      return {
        total: count,
        key: repo.repo,
        doNotMerge: repo.doNotMerge,
        requestsFeedback: requestsFeedback,
        noReviews: noReviews,
        oneReview: oneReview,
        twoOrMoreReviews: twoOrMoreReviews
      }
    },


    flattenPrReport: function (reportData) {
      let parsedData = []
      let flattenedData = {
        total: 0,
        doNotMerge: [],
        requestsFeedback: [],
        noReviews: [],
        oneReview: [],
        twoOrMoreReviews: []
      }

      reportData.forEach(r => {
        parsedData.push(this.preprocessRepoForDisplay(r))
      });

      parsedData.forEach(r => {
        flattenedData.total += r.total

        r.doNotMerge.forEach(e => {
          e.repo = r.key
          flattenedData.doNotMerge.push(e)
        })

        r.requestsFeedback.forEach(e => {
          e.repo = r.key
          flattenedData.requestsFeedback.push(e)
        })

        r.noReviews.forEach(e => {
          e.repo = r.key
          flattenedData.noReviews.push(e)
        })

        r.oneReview.forEach(e => {
          e.repo = r.key
          flattenedData.oneReview.push(e)
        })

        r.twoOrMoreReviews.forEach(e => {
          e.repo = r.key
          flattenedData.twoOrMoreReviews.push(e)
        })
      })

      return flattenedData
    }
  },
  components: {
    PrWatchGroup
  },
  mounted: function() {
    let repositories = [];
    let jsonData = this.$ls.get("repositories");

    if (jsonData) {
      let data = JSON.parse(jsonData);

      data.forEach(element => {
        repositories.push({
          token: element.token,
          owner: element.owner,
          repository: element.repository,
          enterpriseUrl: element.enterpriseUrl,
          key: element.key,
          enabled: false
        });
      });

      this.repositories = repositories;

      this.timeUntilNextRefreshDisplay = 'disabled'
    }
  },
  beforeDestroy: function () {
    this.cleanupIntervalIds()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.gridSpinner {
  font-size: 48px;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

</style>
