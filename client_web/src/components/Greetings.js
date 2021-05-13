import React from 'react';
import './Greetings.scss';
import { ReactComponent as Logo } from 'src/images/greetingsimage.svg';

import useSettings from 'src/hooks/useSettings';


export default function Greetings(props) {
    const settings = useSettings();
    return (
        <div className="Greetings">
            <Logo className="wiggle" style={{ '--greeting-bgd': settings? settings.squiggle: '#E67E22' }} />
            <p>
            Hi, <span className="name">{props.name}</span>
            </p>
        </div>
    );
}
