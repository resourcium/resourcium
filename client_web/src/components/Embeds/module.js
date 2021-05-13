import React from 'react';
import './module.scss';

export default function Module(props){
    return(
        <>
            <div className="courses-container">
                <div className="course">
                    <div className="course-preview">
                        <p className='course-title'>{props.name}</p>
                        <p>{props.type}</p>
                    </div>
                    <div className="course-info">
                        <p>{props.description}</p>
                    </div>
                </div>
            </div>
        </>
    );
}
