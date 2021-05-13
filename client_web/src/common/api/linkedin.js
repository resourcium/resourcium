import { BASE_URL } from '../config';

export async function getResults(accessToken, query) {
    const res = await fetch(BASE_URL + 'query_linkedin', {
        method: 'POST',
        body: JSON.stringify({ accessToken, query }),
    });

    const json = await res.json();
    return json;
}

