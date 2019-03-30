import GithubApi from '@/classes/githubApi.js'
import PullRequestData from '@/classes/pullRequestData.js'

const asyncForEach = async function (values, callback) {
    for (let index = 0; index < values.length; index++) {
        await callback(values[index], index, values)
    }
}

export default class PrReportBuilder {
    constructor() {
    }

    buildReports (targets) {
        if (targets === undefined || targets === null) {
            return []
        }

        return new Promise((resolve, reject) => {
            let children = []
            targets.forEach((t) => {
                children.push(this.buildReport(t))
            })

            Promise.all(children).then((data) => {
                resolve(data)
            }).catch((err) => {
                reject(err)
            })
        })
    }

    async buildReport(repoConfig) {
        let report = {
            repo: repoConfig.githubRepo,
            doNotMerge: [],
            other: []
        }

        let api = new GithubApi({
            token: repoConfig.githubPass
        }, repoConfig.enterpriseUrl);
        let pullRequests = await api.getPullRequests(repoConfig.githubRepo)

        if (pullRequests.length === 0) {
            return report
        }

        let now = new Date()
        await asyncForEach(pullRequests, async (pr) => {
            let simplifiedPr = new PullRequestData(
                pr.number,
                pr.title,
                now - new Date(pr.created_at),
                pr.user.login
            );
            let isDoNotMerge = false;
            pr.labels.forEach(label => {
                if (label.name == "Do Not Merge") {
                    isDoNotMerge = true;
                }
            })

            if (isDoNotMerge) {
                report.doNotMerge.push(simplifiedPr)
            } else {
                report.other.push(simplifiedPr)
            }

            let reviews = await api.getPullRequestReviews(repoConfig.githubRepo, pr.number)
            if (reviews.length > 0) {
                let sortFunc = function(o1, o2) { return new Date(o1.submitted_at) - new Date(o2.submitted_at)}
                reviews.sort(sortFunc).forEach(review => {
                    // NOTE: The add review call keeps only the latest review state due to our sorting.
                    simplifiedPr.addReview(review.user.login, review.state)
                })
            }

        });

        return report;
    }
}