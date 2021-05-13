import { defaultUserSettings, BASE_URL } from '../config';

const SETTING_KEYS = ['twitter', 'twitch', 'darkmode', 'squiggle'];

export async function getSettings(accessToken) {
    const res = await fetch(BASE_URL + 'get_user_settings', {
        method: 'POST',
        body: JSON.stringify({
            accessToken,
        }),
    });

    const json = await res.json();

    const settings = JSON.parse(json['settings']);

    if (!settings) {
        return defaultUserSettings;
    }

    for (let key of SETTING_KEYS) {
        if (!(key in settings)) {
            settings[key] = defaultUserSettings[key];
        }
    }

    return settings;
}

export async function updateSettings(accessToken, settings) {
    const res = await fetch(BASE_URL + 'update_user_settings', {
        method: 'POST',
        body: JSON.stringify({
            accessToken,
            newSettings: JSON.stringify(settings),
        }),
    });

    const json = await res.json();

    // Confirmation of new settings
    return JSON.parse(json['newSettings']);
}

export default { getSettings, updateSettings };
