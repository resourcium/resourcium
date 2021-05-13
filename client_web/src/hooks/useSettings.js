import { useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import api from 'src/common/api/settings';
import { updateSettings } from 'src/state/actions';

import { defaultUserSettings } from 'src/common/config';

function refresh(authToken, dispatch) {
    api.getSettings(authToken).then(settings => {
        if (!settings) {
            dispatch(updateSettings(defaultUserSettings));
        } else {
            dispatch(updateSettings(settings));
        }
    });
}

export default function useSettings() {
    const dispatch = useDispatch();
    const settings = useSelector(state => state.settings);
    const authToken = useSelector(state => state.token);

    useEffect(() => {
        if (!settings && authToken) {
            refresh(authToken, dispatch);
        }
    }, [settings, authToken]);

    return settings || null;
}
