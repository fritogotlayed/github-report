export default class ReportExports {
  constructor () {
  }

  simpleExportAsText (localizationLookup, reportData) {
    /* We manually build this instead of just copying the inner text because the formatting
        needs to be different.
      */
    let body = "";

    let total = reportData.length;
    for (let i = 0; i < total; i) { // i incremented at bottom of loop
      let report = reportData[i];

      // Headers
      body += localizationLookup['repo'] + ": " + report.repo + "\n";
      body += localizationLookup['from'] + ": " + report.fromMarker + "\n";
      body += localizationLookup['to'] + ": " + report.toMarker + "\n";
      body += localizationLookup['generatedAt'] + ": " + report.generatedAt + "\n";
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
  }

  simpleExportAsMarkdown(localizationLookup, reportData) {
    /* We manually build this instead of just copying the inner text because the formatting
        needs to be different.
      */
    let body = "";

    let total = reportData.length;
    for (let i = 0; i < total; i) { // i incremented at bottom of loop
      let report = reportData[i];

      // Headers
      body += "**" + localizationLookup['repo'] + ":** " + report.repo + "\n\n";
      body += "**" + localizationLookup['from'] + ":** " + report.fromMarker + "\n\n";
      body += "**" + localizationLookup['to'] + ":** " + report.toMarker + "\n\n";
      body += "**" + localizationLookup['generatedAt'] + ":** " + report.generatedAt + "\n\n";

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
  }

  restructureToAuthorOrganized(reportData) {
    let returnData = [];

    reportData.forEach(r => {
      // copy over the high level data.
      let repo = {
        repo: r.repo,
        fromMarker: r.fromMarker,
        toMarker: r.toMarker,
        generatedAt: r.generatedAt,
        authors: []
      };

      r.data.forEach(d => {
        let author_name = d.author;
        let author = undefined;
        let len = repo.authors.length;

        // Find the author in our existing data if we can.
        for (var i = 0; i < len; i++) {
          let a = repo.authors[i];
          if (a.name == author_name) {
            author = a;
            break;
          }
        }

        // We couldn't find them so create one.
        if (author === undefined) {
          author = {
            name: author_name,
            data: []
          };
          repo.authors.push(author);
        }

        author.data.push(d);
      });

      returnData.push(repo);
    });

    return returnData;
  }

  authorBasedExportAsText (localizationLookup, reportData) {
    /* We manually build this instead of just copying the inner text because the formatting
        needs to be different.
      */
    let body = "";
    reportData = this.restructureToAuthorOrganized(reportData);

    let total = reportData.length;
    for (let i = 0; i < total; i) { // i incremented at bottom of loop
      let report = reportData[i];

      // Headers
      body += localizationLookup['repo'] + ": " + report.repo + "\n";
      body += localizationLookup['from'] + ": " + report.fromMarker + "\n";
      body += localizationLookup['to'] + ": " + report.toMarker + "\n";
      body += localizationLookup['generatedAt'] + ": " + report.generatedAt + "\n";
      body += "\n";

      // Meat
      report.authors.forEach(function (author) {
        body += "    " + author.name + "\n"
        author.data.forEach(function (pr){
          body += "        " + pr.message + " (PR #: " + pr.number + ")\n";
        })
        body += "\n"
      });

      // Increment the loop and add any spacing if necessary.
      if (++i < total) {
        body += "\n\n";
      }
    }

    return body;
  }

  authorBasedExportAsMarkdown(localizationLookup, reportData) {
    /* We manually build this instead of just copying the inner text because the formatting
        needs to be different.
      */
    let body = "";
    reportData = this.restructureToAuthorOrganized(reportData);

    let total = reportData.length;
    for (let i = 0; i < total; i) { // i incremented at bottom of loop
      let report = reportData[i];

      // Headers
      body += "**" + localizationLookup['repo'] + ":** " + report.repo + "\n\n";
      body += "**" + localizationLookup['from'] + ":** " + report.fromMarker + "\n\n";
      body += "**" + localizationLookup['to'] + ":** " + report.toMarker + "\n\n";
      body += "**" + localizationLookup['generatedAt'] + ":** " + report.generatedAt + "\n\n";

      // Meat
      report.authors.forEach(function (author) {
        body += " * " + author.name + "\n"
        author.data.forEach(function (pr){
          body += "   * [" + pr.message + "](" + pr.url + ")\n"
        })
        body += "\n"
      });

      // Increment the loop and add any spacing if necessary.
      if (++i < total) {
        body += "\n\n";
      }
    }

    return body;
  }

}
