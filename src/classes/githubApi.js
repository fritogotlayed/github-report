const axios = require('axios')

// https://developer.github.com/v3
export default class GithubApi {
  /**
   * Initializes a new GithubApi object
   * @param {string} user The user with which to operate
   * @param {string} password The password or personal access token to authenticate with
   */
  constructor(options, enterpriseUrl) {
    if (options.user && options.password) {
      this.authHeader = 'Basic ' + Buffer.from(options.user + ':' + options.password).toString('base64')
    } else if (options.token) {
      this.authHeader = 'token ' + options.token
    }

    this.enterpriseUrl = enterpriseUrl
  }

  /**
   * Builds a full url to either public github or the configured enterprise github.
   * @param {string} part the url fragment
   */
  _buildUrl(part) {
    let base = 'https://api.github.com/'

    if (this.enterpriseUrl) {
      if (this.enterpriseUrl.endsWith('/')) {
        base = this.enterpriseUrl
      } else {
        base = this.enterpriseUrl + '/'
      }
    }

    if (part.startsWith('/')) {
      part = part.substring(1)
    }

    return base + part
  }

  /**
   * builds the default set of headers for a request to the github API
   * @param {object} headerOverrides Headers needed for the specific request
   */
  _buildBaseHeaders(headerOverrides) {
    let headers = {
      Authorization: this.authHeader
    }

    if (headerOverrides) {
      let keys = Object.keys(headerOverrides)
      keys.forEach(k => {
        headers[k] = headerOverrides[k]
      })
    }

    return headers
  }

  /**
   * Constructs a request then executes it returning a promise to the result
   * @param {string} urlPart A url fragment to request of the github api
   * @param {object} headerOverrides headers needed for the specific request
   */
  _makeRequest(urlPart, headerOverrides) {
    let url = this._buildUrl(urlPart)
    let config = {
      headers: this._buildBaseHeaders(headerOverrides)
    }

    return new Promise((resolve, reject) => {
      axios.get(url, config).then(resp => {
        if (resp.status < 300) {
          resolve(resp.data)
        } else {
          reject(resp)
        }
      }).catch(err => {
        reject(err)
      })
    })
  }

  getPullRequests(repo) {
    return this._makeRequest('repos/' + repo + '/pulls')
  }

  getPullRequestReviews(repo, prNumber) {
    // https://developer.github.com/v3/pulls/reviews/
    return this._makeRequest('repos/' + repo + '/pulls/' + prNumber + '/reviews')
  }

  getTags(repo) {
    return this._makeRequest('repos/' + repo + '/tags')
  }

  getBranches(repo) {
    return this._makeRequest('repos/' + repo + '/branches')
  }

  compareBranches(repo, fromMarker, toMarker) {
    return this._makeRequest('repos/' + repo + '/compare/' + fromMarker + '...' + toMarker)
  }

  getPullRequest(repo, number) {
    return this._makeRequest('repos/' + repo + '/pulls/' + number)
  }
}