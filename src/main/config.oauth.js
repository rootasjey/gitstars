/**
 * Oauth config to connect to GitHub account
 */
module.exports = {
  oauth: {
    clientId: process.env.GITHUB_CLIENT_ID || '0c5d50f318972a2676b6',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || '0bf288d5d87f6bf72baafba627c5bb981faacd58',
    authorizationUrl: 'http://github.com/login/oauth/authorize',
    tokenUrl: 'https://github.com/login/oauth/access_token',
    useBasicAuthorizationHeader: false,
    redirectUri: 'http://localhost' // don't touch me
  }
}
