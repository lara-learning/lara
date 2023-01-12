import React from 'react'
import { Router, Switch } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'

import ApolloProvider from './apollo-provider'
import AppHistory from './app-history'
import { GlobalFonts } from './components/fonts'
import StatusBar from './components/status-bar'
import { ToastContextProvider } from './context/toast/toast-context-provider'
import { useCurrentUserQuery } from './graphql'
import { AuthenticatedState, AuthenticationContext } from './hooks/use-authentication'
import { SplashPage } from './pages/splash-page'
import Routes from './routes'
import ThemeProvider from './theme-provider'

export const App: React.FunctionComponent = () => {
  const [authenticated, setAuthenticated] = React.useState<AuthenticatedState>('loading')

  return (
    <AuthenticationContext.Provider value={{ authenticated, setAuthenticated }}>
      <GoogleOAuthProvider clientId={ENVIRONMENT.googleClientID}>
        <ApolloProvider>
          <InnerApp />
        </ApolloProvider>
      </GoogleOAuthProvider>
    </AuthenticationContext.Provider>
  )
}

const InnerApp: React.FunctionComponent = () => {
  /**
   * This Query is fired twice at the start of the app. This is due to the fact
   * that the authenticationLink is updating the authenticated state which forces
   * this componente to remount and therefor reexecute the query. Workarounds
   * for this problem only introduce unnecessary complexities and so we keep
   * the redundant api call
   */
  const { data, loading } = useCurrentUserQuery()

  return (
    <ThemeProvider currentUser={data?.currentUser}>
      {loading && <SplashPage />}

      {!loading && (
        <ToastContextProvider>
          <Router history={AppHistory.getInstance()}>
            <Switch>
              <Routes currentUser={data?.currentUser} />
            </Switch>

            {ENVIRONMENT.debug && <StatusBar currentUser={data?.currentUser} />}
          </Router>
        </ToastContextProvider>
      )}

      <GlobalFonts />
    </ThemeProvider>
  )
}
