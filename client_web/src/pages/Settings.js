import React, { useEffect, useState, useCallback } from 'react';
import deepEqual from 'deep-equal';

import { useSelector, useDispatch } from 'react-redux';

import api from 'src/common/api/settings';
import { useInput, useCheckbox } from 'src/hooks/input';
import useSettings from 'src/hooks/useSettings';
import { updateSettings } from 'src/state/actions';

import './Settings.scss';

function handleNewSettings(settings, dispatch) {
    dispatch(updateSettings(settings));
}

// Source: https://www.freecodecamp.org/news/javascript-debounce-example
function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, timeout);
    };
}

export default function Settings() {
    const accessToken = useSelector(state => state.token);
    const currentSettings = useSettings();
    const [loadedInitialSettings, setLoaded] = useState(false);

    const [enableTwitter, enableTwitterInput, setEnableTwitter] = useCheckbox({
        name: 'twitter',
    });
    const [twitchStreamer, twitchStreamerInput, setTwitchStreamer] = useInput({
        twitch: 'twitch',
    });

    const [enableDarkMode, enableDarkModeInput, setDarkMode] = useCheckbox({
        name: 'darkmode',
    });
    const [squiggleColor, squiggleColorInput, setSquiggleColor] = useInput({
        type: 'color',
        name: 'squiggle',
    });

    const dispatch = useDispatch();

    const resetInputs = settings => {
        if (settings) {
            setEnableTwitter(settings['twitter']);
            setTwitchStreamer(settings['twitch']);
            setDarkMode(settings['darkmode']);
            setSquiggleColor(settings['squiggle']);
        }
    };

    const debouncedUpdateSettings = useCallback(
        debounce(
            (accessToken, newSettings, cb) =>
                api.updateSettings(accessToken, newSettings).then(cb),
            1000
        ),
        []
    );

    const handleSubmit = e => {
        if (e) e.preventDefault();

        const newSettings = {
            twitch: twitchStreamer,
            twitter: enableTwitter,
            darkmode: enableDarkMode,
            squiggle: squiggleColor,
        };

        debouncedUpdateSettings(accessToken, newSettings, settings => {
            handleNewSettings(settings, dispatch);
        });
    };

    // Every time the component remounts we should reset the inputs,
    // we need to check that we're not resetting if the inital settings have already loaded
    useEffect(() => {
        if (currentSettings && !loadedInitialSettings) {
            resetInputs(currentSettings);
            setLoaded(true);
        }
    }, [currentSettings, loadedInitialSettings]);

    const formSaved = deepEqual(
        {
            twitter: enableTwitter,
            twitch: twitchStreamer,
            darkmode: enableDarkMode,
            squiggle: squiggleColor,
        },
        currentSettings
    );

    if (!loadedInitialSettings) {
        return (
            <div className="Settings page">
                <h2>Settings Page</h2>
                <p>Loading your settings...</p>
            </div>
        );
    }

    // This is debounced so it's okay to call in the render loop
    if (!formSaved) {
        handleSubmit();
    }

    return (
        <div className="Settings page">
            <h2>Settings Page</h2>
            <form onSubmit={handleSubmit}>
                <div className="title">
                    <p> Home page customisation</p>
                    <div className="grid-container">
                        <span className="text">
                            <p>Show the UCL twitter on your home page</p>
                        </span>
                        <span>
                            <label className="switch">
                                {enableTwitterInput}
                                <span className="slider round"></span>
                            </label>
                        </span>
                    </div>
                    <div className="tab">
                        <p>
                            Enter a name of a twitch stream to show on your home
                            page
                        </p>
                        {twitchStreamerInput}
                    </div>
                </div>

                <div className="title">
                    <p>Colour settings</p>
                    <div className="grid-container">
                        <span className="text">
                            <p>Dark mode</p>
                        </span>
                        <span>
                            <label className="switch">
                                {enableDarkModeInput}
                                <span className="slider round"></span>
                            </label>
                        </span>
                    </div>

                    <div className="grid-container">
                        <span className="text">
                            <p>Greetings colour</p>
                        </span>
                        <span>
                            <label>{squiggleColorInput}</label>
                        </span>
                    </div>
                </div>
            </form>
        </div>
    );
}
