<i18n>
{
  "en": {
    "addRepositoryMessage": "Why not add some now!",
    "copyToClipboard": "Copy to Clipboard",
    "copyToClipboardAsText": "Text",
    "copyToClipboardAsMarkdown": "Markdown",
    "copiedToClipboard": "Copy successful!",
    "copyToClipboardModeChanged": "Mode changed to ",
    "from": "From",
    "generatedAt": "Generated At",
    "generateReport": "Generate Report",
    "noRepositoriesMessage": "It appears you do not have any repositories.",
    "repo": "Repo",
    "to": "To"
  }
}
</i18n>

<template>
  <section class="section">
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
          <div v-for="report in reportData" :key="report.repo">

            <div>
              <strong>{{$t("repo")}}</strong> {{report.repo}}
            </div>

            <div>
              <strong>{{$t("from")}}</strong> {{report.fromMarker}}
            </div>

            <div>
              <strong>{{$t("to")}}</strong> {{report.toMarker}}
            </div>

            <div>
              <strong>{{$t("generatedAt")}}</strong> {{report.generatedAt}}
            </div>

            <ul class="pr-list">
              <li v-for="data in report.data" :key="data.url" >
                <a :href="data.url" target="_blank">{{data.message}}</a>
                <a class="button is-white is-loading" v-if="data.isLoading"></a>
            </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  </section>
</template>

<script>
import ReportRepository from '@/components/reportRepository'
import DropdownButton from '@/components/dropdownButton'
let GitHub = require("github-api");

export default {
  name: 'Main',
  data () {
    return {
      copyToClipboardButtonText: "",
      copyToClipboardMode: "text",
      copyToClipboardDropDownData: [],
      repositories: [],
      reportData: [],
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
        parent.copyToClipboardButtonText = parent.$t("copyToClipboard");
      }, 2000);
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
        parent.copyToClipboardButtonText = parent.$t("copyToClipboard");
      }, 2000);
    },
    _convertReportToText: function () {
      /* We manually build this instead of just copying the inner text because the formatting
         needs to be different.
       */
      let parent = this;
      let body = "";

      let total = parent.reportData.length;
      for (let i = 0; i < total; i) { // i incremented at bottom of loop
        let report = parent.reportData[i];

        // Headers
        body += parent.$t("repo") + ": " + report.repo + "\n";
        body += parent.$t("from") + ": " + report.fromMarker + "\n";
        body += parent.$t("to") + ": " + report.toMarker + "\n";
        body += parent.$t("generatedAt") + ": " + report.generatedAt + "\n";
        body += "\n";

        // Meat
        report.data.forEach(function (pr) {
          body += "    " + pr.message + " (PR #: " + pr.number + ")\n";
        });

        // Increment the loop and add any spacing if necessary.
        if (++i < total) {
          body += "\n\n";
        }
      }

      return body;
    },
    _convertReportToMarkdown: function () {
      /* We manually build this instead of just copying the inner text because the formatting
         needs to be different.
       */
      let parent = this;
      let body = "";

      let total = parent.reportData.length;
      for (let i = 0; i < total; i) { // i incremented at bottom of loop
        let report = parent.reportData[i];

        // Headers
        body += "**" + parent.$t("repo") + ":** " + report.repo + "\n\n";
        body += "**" + parent.$t("from") + ":** " + report.fromMarker + "\n\n";
        body += "**" + parent.$t("to") + ":** " + report.toMarker + "\n\n";
        body += "**" + parent.$t("generatedAt") + ":** " + report.generatedAt + "\n\n";

        // Meat
        report.data.forEach(function (pr) {
          body += " * [" + pr.message + "](" + pr.url + ")\n"
        });

        // Increment the loop and add any spacing if necessary.
        if (++i < total) {
          body += "\n\n";
        }
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

          gh = new GitHub({
            token: repo.token
          }, url);
        } else {
          gh = new GitHub({
            token: repo.token
          });
        }
        let r = gh.getRepo(repo.key)
        r.compareBranches(repo.fromMarker, repo.toMarker).then(resp => {
          if (resp.status !== 200) reject('Comparing branches returned 200.')
          let commits = [];
          resp.data.commits.forEach(ghCommit => {
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

              r.getPullRequest(number).then(prResp => {
                commit.message = prResp.data.title;
                commit.isLoading = false;
                commit.url = prResp.data.html_url;
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
    }
  },
  components: {
    ReportRepository,
    DropdownButton
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

      this.copyToClipboardButtonText = this.$t("copyToClipboard");
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
