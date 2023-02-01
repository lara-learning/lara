import { PublicClientApplication } from '@azure/msal-browser'

const redirectDomain = 'localhost:8080'
const redirectUrl = redirectDomain
const tenantId = 'e0793d39-0939-496d-b129-198edd916feb'

export const msalConfig = {
  auth: {
    clientId: 'test',
    authority: 'https://login.microsoftonline.com/' + tenantId,
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

export const MyMSALObj = new PublicClientApplication(msalConfig)
