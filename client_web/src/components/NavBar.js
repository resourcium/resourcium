import React from 'react';
import './NavBar.scss';
import { NavLink } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faChild, faScroll, faSlidersH, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

export default function NavBar() {
    return (
        <div className="NavBar">
            <NavLink to="/" exact={true}>
                <FontAwesomeIcon icon={faHome} />
            </NavLink>
            <NavLink to="/RegisterPage">
                <FontAwesomeIcon icon={faScroll} />
            </NavLink>
            <NavLink to="/FormPage">
                <FontAwesomeIcon icon={faChild} />
            </NavLink>
            <NavLink to="/StudentHelp">
                <FontAwesomeIcon icon={faInfoCircle} />
            </NavLink>
            <NavLink to="/SettingsPage">
                <FontAwesomeIcon icon={faSlidersH} />
            </NavLink>
        </div>
    );
}
