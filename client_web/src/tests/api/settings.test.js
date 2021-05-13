import { getSettings, updateSettings } from 'src/common/api/settings';

import { defaultUserSettings } from 'src/common/config';

describe('settings api', () => {
    const accessToken = process.env.ACCESS_TOKEN;

    it('stores and retrieves settings', async () => {
        const exampleSettings = { twitch: 'microsoftdeveloper', twitter: true };
        await updateSettings(accessToken, exampleSettings);
        const retrievedSettings = await getSettings(accessToken);

        expect(retrievedSettings.twitch).toEqual(exampleSettings.twitch);
        expect(retrievedSettings.twitter).toEqual(exampleSettings.twitter);
    });

    it('fills in defaults', async () => {
        await updateSettings(accessToken, {});

        const retrievedSettings = await getSettings(accessToken);

        for (let key of Object.keys(defaultUserSettings)) {
            expect(retrievedSettings[key]).toEqual(defaultUserSettings[key]);
        }
    });
});
