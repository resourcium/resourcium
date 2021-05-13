import React, { useState } from 'react';
import { getResults } from 'src/common/api/linkedin';
import { useSelector } from 'react-redux';
import Module from './module';

const map = {
    LEARNING_PATH: 'Learning Path',
    COURSE: 'Course',
    VIDEO: 'Video',
};

export default function LinkedinLearningContainer() {
    const authToken = useSelector(state => state.token);
    const [search, setSearch] = useState('');
    const [results, setData] = useState([]);
    const [resultQuery, setResultQuery] = useState('');
    const handleChange = event => {
        setSearch(event.target.value);
    };

    const callSearchFunction = e => {
        e.preventDefault();
        getResults(authToken, search).then(data => {
            setData(data);
            setResultQuery(search);
        });
    };
    const resultSection = resultQuery ? (
        <div className="modulecontainer">
            {results.length === 0 ? (
                <p>No results for {resultQuery}</p>
            ) : (
                <p>Showing results for {resultQuery}</p>
            )}
            {results.map(result => (
                <a
                    key={result.urn}
                    href={result.details.urls.webLaunch}
                    target="_blank"
                    rel="noreferrer"
                    className="module"
                >
                    <Module
                        name={result.title.value}
                        type={map[result.type]}
                        description={result.details.description.value}
                    />
                </a>
            ))}
        </div>
    ) : null;

    return (
        <>
            <p>Search for help via Linkedin</p>

            <div className="modules">
                <div className="searchContainer">
                    <form onSubmit={callSearchFunction}>
                        <input
                            value={search}
                            onChange={handleChange}
                            type="text"
                            className="inputbar"
                        />
                        <input
                            className="searchbtn"
                            type="submit"
                            value="SEARCH"
                        />
                    </form>
                </div>
                {resultSection}
            </div>
        </>
    );
}
