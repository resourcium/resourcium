import { getResults } from 'src/common/api/linkedin';

describe('linkedin api', () => {
    const accessToken = process.env.ACCESS_TOKEN;

    it('returns successfully', async () => {
        // We can rely on specific things being returned as new courses may get created on linkedin learning.
        // If there is an issue and error will be thrown.
        const results = await getResults(accessToken, 'azure');

        expect(results.length == 0).toBe(false);
    });
});
