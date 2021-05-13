//https://dev.to/heymarkkop/embed-twitter-widget-on-reactjs-1768 - Reference to code

import React, { useEffect } from 'react';

import { TWITTER_FEED_URL } from 'src/common/config';

export default function TwitterContainer({ enabled = true }) {
    useEffect(() => {
        if (enabled) {
            // TODO: make this more react
            const anchor = document.createElement('a');
            anchor.setAttribute('class', 'twitter-timeline');
            anchor.setAttribute('data-theme', 'dark');
            anchor.setAttribute('data-tweet-limit', '3');
            anchor.setAttribute('data-chrome', 'noheader nofooter noborders');
            anchor.setAttribute(
                'href',
                // TODO: replace with config
                TWITTER_FEED_URL
            );
            document
                .getElementsByClassName('twitter-embed')[0]
                .appendChild(anchor);

            const script = document.createElement('script');
            script.setAttribute(
                'src',
                'https://platform.twitter.com/widgets.js'
            );
            document
                .getElementsByClassName('twitter-embed')[0]
                .appendChild(script);
        }
    }, [enabled]);

    if (enabled) {
        return (
            <section className="twitterContainer">
                <div className="twitter-embed"></div>
            </section>
        );
    } else {
        return null;
    }
}
