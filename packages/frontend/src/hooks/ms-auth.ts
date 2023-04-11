const redirectDomain = 'http://localhost:8080'
const redirectUrl = redirectDomain
const { MICROSOFT_API_KEY } = process.env
const { MICROSOFT_TENANT_ID } = process.env

export const msalConfig = {
  auth: {
    clientId: MICROSOFT_API_KEY,
    authority: 'https://login.microsoftonline.com/' + MICROSOFT_TENANT_ID,
    redirectUri: redirectUrl,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
}

export const loginRequest = {
  scopes: ['User.Read', 'openid', 'profile'],
}
