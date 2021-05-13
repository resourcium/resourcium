import React from 'react';
import './Links.scss';
import { USEFUL_LINKS } from 'src/common/config';

export default function Other() {
    /*var today = new Date();
    var date_today = today.getFullYear() + '-' + today.getMonth() + '-' + today.getDay();
    var time_today = today.getHours()+':'+today.getMinutes()+':'+today.getSeconds();

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var date_tom = tomorrow.getFullYear() + '-' + tomorrow.getMonth()+ '-' + tomorrow.getDay();
    */
    return (
        <div className="other">
            <p>Here are some useful links within and outside of the university that you may want to engage with.</p>
            {USEFUL_LINKS.map((link, i) => (
                <a href={link.href} key={i} target="_blank" rel="noreferrer">
                    {link.label}
                </a>
            ))}
        </div>
    );
}
