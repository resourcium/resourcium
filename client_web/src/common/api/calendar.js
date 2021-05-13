import * as graph from '@microsoft/microsoft-graph-client';

export async function getCalendar(accessToken) {
    const client = graph.Client.init({
        authProvider: done => done(null, accessToken),
    });
    const date = new Date().toISOString();
    const response = await client.api('/me/calendar/events?$filter=start/dateTime ge \''+date+'\'').select('subject,organizer,attendees,start,end,location').get();
    return response;
}

/**
 * https://graph.microsoft.com/v1.0/me/events?$filter=start/dateTime ge '2017-07-01T08:00'
 */