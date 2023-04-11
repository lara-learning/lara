import React, {ButtonHTMLAttributes, useState} from 'react'
import AppHistory from '../app-history'
import { PrimaryButton } from './button'
import {useMsal} from "@azure/msal-react";
import {loginRequest} from "../hooks/ms-auth";
import {useAuthentication} from "../hooks/use-authentication";
import {useLoginPageLoginMutation} from "../graphql";
import {useIsAuthenticated } from "@azure/msal-react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  fullsize?: boolean
}
export const SignInButton: React.FunctionComponent<ButtonProps> = () => {
  const { instance, accounts } = useMsal();
  const [msalAccessToken, setAccessToken] = useState("");
  const { login } = useAuthentication()
  const [mutate] = useLoginPageLoginMutation()
  const isAuthenticated = useIsAuthenticated();

  const RequestMsalAccessToken = () => {
    const request = {
      ...loginRequest,
      account: accounts[0]
    };
    // Silently acquires an access token which is then attached to a request for Microsoft Graph data
    instance.acquireTokenSilent(request).then((response) => {
      setAccessToken(response.accessToken);
    }).catch(() => {
      instance.acquireTokenPopup(request).then((response) => {
        setAccessToken(response.accessToken);
      });
    });
  }
  const handleLogin = (loginType: any) => {
    if (loginType === 'redirect') {
      instance.loginRedirect(loginRequest).catch((e) => {
        console.log(e)
      })
    }

    if(isAuthenticated){
        RequestMsalAccessToken()

        const accessToken = msalAccessToken
        console.log(accessToken)

        mutate({ variables: { token: accessToken } }).then((response) => {
          const { data } = response
          if (!data?.login) {
            return AppHistory.getInstance().push('/no-user-found')
          }
          login(data.login)
        })
      }
    }
  return <PrimaryButton onClick={() => handleLogin('redirect')}>sign in with ACN</PrimaryButton>
}
