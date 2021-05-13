import React from 'react';

import classnames from 'classnames';
import Login from './pages/Login';
import HomePage from './pages/Home';
import Greetings from './components/Greetings';
import { useSelector } from 'react-redux';

import './App.scss';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import FormPage from './pages/Forms';
import SettingsPage from './pages/Settings';
import RegisterPage from './pages/Register';
import StudentHelp from './pages/StudentHelp';
import NavBar from './components/NavBar';

import { Provider } from 'react-redux';
import store from './state/store';

import useSettings from 'src/hooks/useSettings';

function App() {
    const accessToken = useSelector(state => state.token);
    const user = useSelector(state => state.user);
    const settings = useSettings();

    if (!user || !accessToken) {
        return (
            <BrowserRouter>
                <div id="app" className="mobile">
                    <Login />
                </div>
            </BrowserRouter>
        );
    }

    const name = user.givenName || user.displayName;

    return (
        <div
            id="app"
            className={classnames('mobile', {
                dark: settings ? settings.darkmode : false,
            })}
        >
            <BrowserRouter>
                <Greetings name={name} />
                <Switch>
                    <Route path="/FormPage" component={FormPage} />
                    <Route path="/SettingsPage" component={SettingsPage} />
                    <Route path="/RegisterPage" component={RegisterPage} />
                    <Route path="/StudentHelp" component={StudentHelp} />
                    <Route path="/" component={HomePage} />
                </Switch>
                <NavBar />
            </BrowserRouter>
        </div>
    );
}

export default function AppWithStore() {
    return (
        <Provider store={store}>
            <App />
        </Provider>
    );
}
