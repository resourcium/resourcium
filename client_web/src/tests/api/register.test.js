import {
    register,
    getSecondFactorStatus,
    setupSecondFactor,
    verifySecondFactor,
    resetSecondFactor,
} from 'src/common/api/register';

describe('register api', () => {
    const accessToken = process.env.ACCESS_TOKEN;
    let secret;

    it('resets 2fa before starting', async () => {
        await resetSecondFactor(accessToken);
    });

    it('intially shows 2fa is not setup', async () => {
        const res = await getSecondFactorStatus(accessToken);
        expect(res).toEqual('NOT_SETUP');
    });

    it('verify 2fa should not work after reset', async () => {
        const res = await verifySecondFactor(accessToken, '123456');
        expect(res.error).toEqual('User has not registered');
    });

    it('register should not work after reset', async () => {
        const res = await register(accessToken, '123456');
        expect(res.error).toEqual('User has not registered 2fa');
    });

    it('sets up and returns secret', async () => {
        const res = await setupSecondFactor(accessToken);
        expect(res.totp_secret).toBeDefined();
        expect(res.totp_url).toBeDefined();

        secret = res.totp_secret;
    });

    it('no verification means 2fa is not setup', async () => {
        const res = await getSecondFactorStatus(accessToken);
        expect(res).toEqual('NOT_SETUP');
    });
});
