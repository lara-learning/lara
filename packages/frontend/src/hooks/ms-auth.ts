export const msalConfig = {
  auth: {
    clientId: ENVIRONMENT.microsoftClientID ?? '',
    authority: 'https://login.microsoftonline.com/' + ENVIRONMENT.microsoftTenantID,
    knownAuthorities: ['https://login.microsoftonline.com/' + ENVIRONMENT.microsoftTenantID + '/v2.0/.well-known/openid-configuration'],
    redirectUri: ENVIRONMENT.frontendUrl,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
}

export const loginRequest = {
  scopes: ['User.Read', 'openid', 'profile'],
}
