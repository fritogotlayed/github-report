<i18n>
{
  "en": {
    "addRepositoryMessage": "Why not add some now!",
    "copyToClipboard": "Copy to Clipboard",
    "copyToClipboardAsText": "Text",
    "copyToClipboardAsMarkdown": "Markdown",
    "copyToClipboardModeTxt": "txt",
    "copyToClipboardModeMarkdown": "md",
    "copiedToClipboard": "Copy successful!",
    "copyToClipboardModeChanged": "Mode changed to ",
    "from": "From",
    "generatedAt": "Generated At",
    "generateReport": "Generate Report",
    "noRepositoriesMessage": "It appears you do not have any repositories.",
    "repo": "Repo",
    "reportMode": "Report Mode",
    "to": "To"
  }
}
</i18n>

<template>
  <section class="section">

    <div class="columns">
      <div class="column is-3">
        <label>{{$t("reportMode")}}</label>
      </div>
      <div class="column is-9">
        <Dropdown :data="availableReportModes" :value="reportMode" @selection-made="reportModeChanged" />
      </div>
    </div>

    <div class="columns" v-if="repositories.length < 1">
      <div class="column">
        {{$t("noRepositoriesMessage")}}
        <a v-on:click="$router.push({name: 'Repositories'})">{{$t("addRepositoryMessage")}}</a>
      </div>
    </div>
    <div class="columns" v-if="repositories.length > 0">
      <div class="column">
        <div v-for="(repo, index) in repositories" :key="repo.key">
          <ReportRepository v-model="repositories[index]" />
        </div>
      </div>
    </div>

    <div class="columns" v-if="repositories.length > 0">
      <div class="column">
        <div class="field is-grouped">
          <div class="control">
            <a :class="generateReportCSS" @click="buildReport">
              <span>{{$t("generateReport")}}</span>
            </a>
          </div>

          <DropdownButton
            :buttonText="copyToClipboardButtonText"
            :dropdownData="copyToClipboardDropDownData"
            @click="exportReport"
            @selection-made="setCopyToClipboardMode"
            v-if="reportData.length > 0" />

        </div>
        <textarea id="clipboardHelper"></textarea>
      </div>
    </div>
    <div class="columns" v-if="repositories.length > 0">
      <div class="column">
        <div class="content">
          <ReportViewSimple v-if="reportMode == 'simple'" :reportData="reportData"/>
          <ReportViewByUser v-if="reportMode == 'byUser'" :reportData="reportData"/>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Dropdown from '@/components/dropdown'
import DropdownButton from '@/components/dropdownButton'
import ReportRepository from '@/components/reportRepository'
import ReportExports from '@/classes/reportExports'
import ReportViewSimple from '@/components/reportViewSimple'
import ReportViewByUser from '@/components/reportViewByUser'

import GithubApi from '@/classes/githubApi.js'
// let GitHub = require("github-api");

export default {
  name: 'Report',
  data () {
    return {
      availableReportModes: [
        { key: 'simple', display: 'Simple' },
        { key: 'byUser', display: 'By User' }
      ],
      copyToClipboardButtonText: "",
      copyToClipboardMode: "text",
      copyToClipboardDropDownData: [],
      repositories: [],
      reportData: [],
      reportMode: 'simple',
      generateReportCSS: {
        'is-loading': false,
        'button': true,
        'is-primary': true
      },
      reposForReportCount: 0,
      reposGeneratedCount: 0
    }
  },
  methods: {
    setCopyToClipboardMode: function (mode) {
      let parent = this;
      parent.copyToClipboardMode = mode;
      let copySetting = this.$ls.set("copyToClipboardSetting", mode);

      parent.copyToClipboardButtonText = parent.$t("copyToClipboardModeChanged") + mode;
      setTimeout(() => {
        parent.setCopyToClipboardButtonText(mode)
      }, 2000);
    },
    setCopyToClipboardButtonText: function(mode) {
      let parent = this;
      let key = ((mode == "text") ? "copyToClipboardModeTxt" : "copyToClipboardModeMarkdown");
      parent.copyToClipboardButtonText = parent.$t("copyToClipboard") + " [" + parent.$t(key) + "]";
    },
    exportReport: function () {
      let parent = this;
      let helper = document.getElementById("clipboardHelper");

      if (parent.copyToClipboardMode == "markdown"){
        helper.value = parent._convertReportToMarkdown();
      } else {
        helper.value = parent._convertReportToText();
      }
      helper.select();
      document.execCommand("copy");
      helper.value = "";

      parent.copyToClipboardButtonText = parent.$t("copiedToClipboard");
      setTimeout(() => {
        parent.setCopyToClipboardButtonText(parent.copyToClipboardMode)
      }, 2000);
    },
    _convertReportToText: function () {
      let re = new ReportExports()
      let lookup = {
        repo: this.$t('repo'),
        from: this.$t('from'),
        to: this.$t('to'),
        generatedAt: this.$t('generatedAt')
      }

      let body = undefined;
      switch (this.reportMode) {
        case 'byUser':
          body = re.authorBasedExportAsText(lookup, this.reportData)
          break;
        default:
          body = re.simpleExportAsText(lookup, this.reportData)
          break;
      }
      return body;
    },
    _convertReportToMarkdown: function () {
      let re = new ReportExports()
      let lookup = {
        repo: this.$t('repo'),
        from: this.$t('from'),
        to: this.$t('to'),
        generatedAt: this.$t('generatedAt')
      }
      let body = undefined;
      switch (this.reportMode) {
        case 'byUser':
          body = re.authorBasedExportAsMarkdown(lookup, this.reportData)
          break;
        default:
          body = re.simpleExportAsMarkdown(lookup, this.reportData)
          break;
      }
      return body;
    },
    buildReport: function () {
      let parent = this;
      parent.reportData = [];
      parent.reposGeneratedCount = 0;
      parent.reposForReportCount = 0;

      this.repositories.forEach(repo => {
        if (repo.selected === true){
          parent.reposForReportCount += 1;
          parent.generateReportCSS['is-loading'] = true;

          this._buildReportForRepo(repo).then(data => {
            parent.reposGeneratedCount += 1;
            parent.reportData.push({
              repo: data.owner + '/' + data.name,
              fromMarker: data.fromMarker,
              toMarker: data.toMarker,
              generatedAt: new Date().toUTCString(),
              data: data.commits
            });

            if (parent.reposGeneratedCount === parent.reposForReportCount) {
              parent.reposForReportCount = 0;
              parent.generateReportCSS['is-loading'] = false;
            }
          }).catch(reason => {
            console.log(reason);
            parent.reposForReportCount = 0;
            parent.generateReportCSS['is-loading'] = false;
          })
        }
      })
    },
    _buildReportForRepo: function (repo) {
      let parent = this;
      let mergeRegex = this._buildPullRequestRegex();
      let returnData = {
        owner: repo.owner,
        name: repo.repository,
        fromMarker: repo.fromMarker,
        toMarker: repo.toMarker,
        commits: null
      }

      return new Promise((resolve, reject) => {
        let gh = null;
        if (repo.enterpriseUrl){
          let url = repo.enterpriseUrl;

          if (!url.endsWith("/")) {
            url += "/";
          }
          url += "api/v3"

          gh = new GithubApi({
            token: repo.token
          }, url);
        } else {
          gh = new GithubApi({
            token: repo.token
          });
        }
        gh.compareBranches(repo.key, repo.fromMarker, repo.toMarker).then(data => {
          let commits = [];
          data.commits.forEach(ghCommit => {
            let parts = mergeRegex.exec(ghCommit.commit.message);
            if (parts !== null && parts !== undefined) {
              let number = this._extractPullRequestNumber(ghCommit.commit.message);
              // TODO: Get the URL properly
              let msg = ghCommit.commit.message;
              let firstNewLine = msg.indexOf("\n")

              if (firstNewLine > -1) {
                let substr = msg.substr(0, firstNewLine).replace("\r", "").replace("\n", "");
                msg = substr;
              }

              let commit = {
                message: msg,
                number: number,
                isLoading: true
              };

              gh.getPullRequest(repo.key, number).then(data => {
                commit.message = data.title;
                commit.isLoading = false;
                commit.url = data.html_url;
                commit.author = data.user.login;
              });

              commits.push(commit);
            }
          })

          returnData.commits = commits;
          resolve(returnData);
        });
      })
    },
    _buildPullRequestRegex: function () {
      // NOTE: Please keep this near "_extractPullRequestNumber"
      // Match one of the following:
      //   Merge Pull Request #...    -- This captures any non-fast-forward merges
      //   ... (#X)                   -- This captures any squash and merge merges
      let reg = new RegExp(/.*Merge pull request #.*|.* \(\#\d+\).*/)
      return reg;
    },
    _extractPullRequestNumber: function (commitMessage) {
      // NOTE: Please keep this near "_buildPullRequestRegex"
      if (commitMessage.startsWith("Merge pull request #")){
        // Extract number from "Merge pull request #123 ..."
        let spaceIndex = commitMessage.indexOf(" ", 20);
        let part = commitMessage.substring(20, spaceIndex);
        return part;
      } else if (new RegExp(/ \(\#\d+\)/).test(commitMessage)) {
        // Extract merge number from end of squash merge. Ex "foo bar bum (#123)"
        let startIndex = commitMessage.lastIndexOf("#");
        let closeIndex = commitMessage.indexOf(")", startIndex);
        let part = commitMessage.substring(startIndex+1, closeIndex);
        return part
      }
    },
    reportModeChanged: function(mode) {
      this.reportMode = mode;
    }
  },
  components: {
    ReportRepository,
    DropdownButton,
    ReportViewSimple,
    ReportViewByUser,
    Dropdown
  },
  mounted: function() {
    let repositories = [];
    let jsonData = this.$ls.get("repositories");
    let copySetting = this.$ls.get("copyToClipboardSetting");

    this.copyToClipboardDropDownData = [
      { key: "text", display: this.$t("copyToClipboardAsText") },
      { key: "markdown", display: this.$t("copyToClipboardAsMarkdown") }
    ];

    if (copySetting) {
      this.copyToClipboardMode = copySetting;
    } else {
      this.copyToClipboardMode = "text";
    }

    if (jsonData) {
      let data = JSON.parse(jsonData);

      data.forEach(element => {
        repositories.push({
          token: element.token,
          owner: element.owner,
          repository: element.repository,
          enterpriseUrl: element.enterpriseUrl,
          key: element.key,
          selected: false,
          fromMarker: null,
          toMarker: null
        });
      });
      this.repositories = repositories;
    }

      this.setCopyToClipboardButtonText(this.copyToClipboardMode)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.pr-list {
  list-style: none;
  margin-left: 0em;
}

#clipboardHelper {
  /* NOTE: Keep this element out of the viewport. Setting display none will cause
  copy to clipboard to stop working. */
  position: absolute;
  left: -1000px;
  top: -1000px
}
</style>
