import React from 'react'
import ReactDOM from 'react-dom'
import { MsalProvider } from '@azure/msal-react'
import { msalConfig } from './hooks/ms-auth'

import { App } from './app'
import { PublicClientApplication } from '@azure/msal-browser'

const msalInstance = new PublicClientApplication(msalConfig)

ReactDOM.render(
  <MsalProvider instance={msalInstance}>
    <App />
  </MsalProvider>,
  document.getElementById('app')
)

if (module.hot && ENVIRONMENT.debug) {
  module.hot.accept()
}
