import React from 'react'
import { BrowserRouter } from 'react-router'
import ApolloProvider from './apollo-provider'
import StatusBar from './components/status-bar'
import AppRoutes from './routes'
import ThemeProvider from './theme-provider'
import { AuthenticatedState, AuthenticationContext } from './hooks/use-authentication'
import { GlobalFonts } from './components/fonts'
import { MsalProvider } from '@azure/msal-react'
import { msalConfig } from './hooks/ms-auth'
import { PublicClientApplication } from '@azure/msal-browser'
import { SplashPage } from './pages/splash-page'
import { ToastContextProvider } from './context/toast/toast-context-provider'
import { useCurrentUserQuery } from './graphql'

const msalInstance = new PublicClientApplication(msalConfig)
export const App: React.FunctionComponent = () => {
  const [authenticated, setAuthenticated] = React.useState<AuthenticatedState>('loading')

  return (
    <MsalProvider instance={msalInstance}>
      <AuthenticationContext.Provider value={{ authenticated, setAuthenticated }}>
        <ApolloProvider>
          <InnerApp />
        </ApolloProvider>
      </AuthenticationContext.Provider>
    </MsalProvider>
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
  const currentUser = data?.currentUser

  return (
    <ThemeProvider currentUser={currentUser}>
      {loading && <SplashPage />}

      {!loading && (
        <ToastContextProvider>
          <BrowserRouter>
            <AppRoutes currentUser={currentUser} />
            {ENVIRONMENT.debug && <StatusBar currentUser={currentUser} />}
          </BrowserRouter>
        </ToastContextProvider>
      )}

      <GlobalFonts />
    </ThemeProvider>
  )
}
