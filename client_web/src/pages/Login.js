import React, { useCallback, useEffect, useState } from 'react';
import './Login.scss';
import logo from 'src/images/ucl-logo.jpg';
import * as Msal from 'msal';
import { useDispatch } from 'react-redux';
import { login } from '../state/actions';
import * as graph from '@microsoft/microsoft-graph-client';

import { AZURE_DETAILS } from 'src/common/config';

function getAccessToken(msalInstance) {
    const request = { scopes: AZURE_DETAILS.scopes };

    msalInstance.loginRedirect(request);
}

export async function getUserDetails(accessToken) {
    const client = graph.Client.init({
        authProvider: done => done(null, accessToken),
    });

    return await client.api('/me').get();
}

export default function Login() {
    const [msalInstance, setMsalInstance] = useState();
    const dispatch = useDispatch();

    const handleAccessToken = accessToken => {
        getUserDetails(accessToken)
            .then(user => {
                dispatch(login(user, accessToken));
                if (
                    !process.env.NODE_ENV ||
                    process.env.NODE_ENV === 'development'
                ) {
                    console.log('Access Token:', accessToken);
                }
            })
            .catch(err => {
                console.log('Error getting user', err);
            });
    };

    useEffect(() => {
        const msal = new Msal.UserAgentApplication({
            auth: {
                clientId: AZURE_DETAILS.appId,
                redirectUri: window.location.origin,
                postLogoutRedirectUri: window.location,
            },
            cache: {
                cacheLocation: 'localStorage',
            },
        });

        msal.handleRedirectCallback(error => {
            if (error) {
                console.error('Redirect callback error', error);
                return;
            }

            const request = { scopes: AZURE_DETAILS.scopes };

            msal.acquireTokenSilent(request)
                .then(accessTokenResponse => {
                    console.debug('Silent response');
                    handleAccessToken(accessTokenResponse.accessToken);
                })
                .catch(error => {
                    console.error('Failed to acquire token silently', error);
                    msal.acquireTokenRedirect(request);
                });
        });

        setMsalInstance(msal);
    }, []);

    const startLogin = useCallback(() => {
        getAccessToken(msalInstance);
    });

    useEffect(() => {
        const accessTokenParam = new URLSearchParams(
            window.location.search
        ).get('accessToken');

        if (accessTokenParam) {
            handleAccessToken(accessTokenParam);
        }
    }, []);

    return (
        <div className="Login">
            <div className="box" onClick={startLogin}>
                <img src={logo}></img>
                <h2>Sign in with SSO</h2>
            </div>
        </div>
    );
}
