import { getCalendar } from 'src/common/api/calendar';

describe('calendar api', () => {
    const accessToken = process.env.ACCESS_TOKEN;

    it('returns successfully', async () => {
        // Since we can't programatically create meetings and such we only test that it works
        // If there is an issue and error will be thrown.
        await getCalendar(accessToken);
    });
});
