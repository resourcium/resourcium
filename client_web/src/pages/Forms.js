import React from 'react';

import { WELLBEING_LINKS } from 'src/common/config';

import './Forms.scss';
//https://forms.office.com/Pages/ShareFormPage.aspx?id=jnDz8R-0wUKyZ6gJDYDz7Ee6R-0qnPpDsQbYeCN2iARUMzRRN002U1dGUUU0OU5GMTNPNko1VFRHQi4u&sharetoken=qznLlgcV42CHf3KnyR2y
//This is the pain points form duplication link

//https://forms.office.com/Pages/ShareFormPage.aspx?id=jnDz8R-0wUKyZ6gJDYDz7Ee6R-0qnPpDsQbYeCN2iARUOEdGUU1WTUQxVlRMTkpJNVo5Mk02TVhGMC4u&sharetoken=Oj3A2AbH6qqOrUXnZ4Wh
//This is the form for additional help duplication link.

export default function FormPage() {
    return (
        <div className="FormsPage page">
            <h2>Student Wellbeing page</h2>
            <div className="intro">
                <p>
                    Use this page to report your stress levels, course blockers
                    as well as areas where you require help in. Below are the
                    forms that are currently available to you.
                </p>
            </div>
            {WELLBEING_LINKS.map((link, i) => (
                <React.Fragment key={i}>
                    <hr />
                    <div className="FormSection">
                        <p>{link.description}</p>
                        <a href={link.href} target="_blank" rel="noreferrer">{link.label}</a>
                    </div>
                </React.Fragment>
            ))}
        </div>
    );
}
