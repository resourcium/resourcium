import { Provider } from 'react-redux';
import store from 'src/state/store';
import { login as loginAction } from 'src/state/actions';
import React from 'react';

import { getUserDetails } from 'src/pages/Login';

export const login = async component => {
    const accessToken = process.env.ACCESS_TOKEN;

    if (!accessToken) {
        throw new Error(
            'You must set the ACCESS_TOKEN environment variable before running tests'
        );
    }

    let user = await getUserDetails(accessToken);
    store.dispatch(loginAction(user, accessToken));

    return <Provider store={store}>{component}</Provider>;
};

export const wrapProvider = component => {
    return <Provider store={store}>{component}</Provider>;
};
