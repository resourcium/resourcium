import { BASE_URL } from '../config';

export async function setupSecondFactor(accessToken) {
    const res = await fetch(BASE_URL + 'setup_2fa', {
        method: 'POST',
        body: JSON.stringify({ accessToken }),
    });

    const json = await res.json();

    return json;
}

export async function getSecondFactorStatus(accessToken) {
    const res = await fetch(BASE_URL + 'get_2fa_status', {
        method: 'POST',
        body: JSON.stringify({ accessToken }),
    });

    const json = await res.json();

    return json['status'];
}

export async function register(accessToken, totpToken) {
    const res = await fetch(BASE_URL + 'register', {
        method: 'POST',
        body: JSON.stringify({ accessToken, totpToken }),
    });

    const json = await res.json();

    return json;
}

export async function verifySecondFactor(accessToken, totpToken) {
    const res = await fetch(BASE_URL + 'verify_2fa', {
        method: 'POST',
        body: JSON.stringify({ accessToken, totpToken }),
    });

    const json = await res.json();

    return json;
}

export async function resetSecondFactor(accessToken) {
    const res = await fetch(BASE_URL + 'reset_2fa', {
        method: 'POST',
        body: JSON.stringify({ accessToken }),
    });

    return res;
}
