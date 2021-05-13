import React, { useMemo, useState, useEffect } from 'react';
import ReactTwitchEmbedVideo from 'react-twitch-embed-video';
import TwitterContainer from 'src/components/Embeds/TwitterContainer';
import useSettings from 'src/hooks/useSettings';
import { useSelector } from 'react-redux';
import { getCalendar } from 'src/common/api/calendar';
import UsefulLinks from 'src/components/Links';

import Tabs from 'src/components/Tabs';

function HomeTabs({ settings }) {
    if (!settings) {
        return null;
    }

    const tabs = useMemo(() => {
        const twitter = settings['twitter']
            ? {
                content: <TwitterContainer />,
                label: 'Twitter',
            }
            : null;

        const twitch = settings['twitch']
            ? {
                content: (
                    <ReactTwitchEmbedVideo
                        channel={settings['twitch']}
                        width="100%"
                    />
                ),
                label: 'Twitch',
            }
            : null;

        const usefulLinks = {
            content: <UsefulLinks />,
            label: 'Links',
        };

        return { twitter, twitch, usefulLinks };
    }, [settings]);

    return <Tabs tabs={tabs} />;
}

const Meetings2 = props => {
    const [meetings, setMeetings] = useState([]);

    useEffect(() => {
        getCalendar(props.token).then(data => setMeetings(data.value));
    }, []);

    function n(n) {
        return n > 9 ? '' + n : '0' + n;
    }

    if (meetings.length == 0) {
        return <p className="meeting">You have no meetings</p>;
    }
    return (
        <div>
            {meetings.splice(meetings.length-1, meetings.length).map((result, index) => {
                const date = new Date(result.start.dateTime);
                return (
                    <p key={index} className="meeting">
                        Your next meeting is on the {n(date.getDate())}/
                        {n(date.getMonth() + 1)}/{date.getFullYear()} starting
                        at {n(date.getHours())}:{n(date.getMinutes())}:
                        {n(date.getSeconds())} regarding {result.subject}
                    </p>
                );
            })}
        </div>
    );
};

export default function HomePage() {
    const settings = useSettings();
    const authToken = useSelector(state => state.token);
    // Wait for settings to load
    if (!settings) {
        return null;
    }

    return (
        <div className="HomePage page">
            <h2>Home Page</h2>
            <Meetings2 token={authToken} />
            <HomeTabs settings={settings} />
        </div>
    );
}
